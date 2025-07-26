package com.farmtech.livestock.service;

import com.farmtech.livestock.dto.AuthResponse;
import com.farmtech.livestock.dto.LoginRequest;
import com.farmtech.livestock.dto.RegisterRequest;
import com.farmtech.livestock.model.FarmerProfile;
import com.farmtech.livestock.model.User;
import com.farmtech.livestock.model.UserRole;
import com.farmtech.livestock.repository.FarmerProfileRepository;

import com.farmtech.livestock.repository.UserRepository;
import com.farmtech.livestock.repository.UserRoleRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.SecretKey;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository roleRepository;

    @Autowired
    private FarmerProfileRepository farmerProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // JWT Configuration
    @Value("${jwt.secret:farmtech-livestock-secret-key-that-should-be-at-least-32-characters-long}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400}") // 24 hours
    private Long jwtExpirationTime;

    @Value("${jwt.refresh.expiration:604800}") // 7 days
    private Long refreshTokenExpirationTime;

    // In-memory refresh token store
    private final Set<String> validRefreshTokens = ConcurrentHashMap.newKeySet();

    public AuthResponse register(RegisterRequest registerRequest) {
        validateRegisterRequest(registerRequest);

        if (userRepository.existsByUsername(registerRequest.getUsername().trim())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail().trim().toLowerCase())) {
            throw new RuntimeException("Email already exists");
        }

        try {
            UserRole.RoleName roleEnum = registerRequest.getRole();
            UserRole role = roleRepository.findByRoleName(roleEnum)
                    .orElseThrow(() -> new RuntimeException("Role not found in database: " + roleEnum));

            User user = new User();
            user.setUsername(registerRequest.getUsername().trim());
            user.setEmail(registerRequest.getEmail().trim().toLowerCase());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.setFirstName(trimOrNull(registerRequest.getFirstName()));
            user.setLastName(trimOrNull(registerRequest.getLastName()));
            user.setPhoneNumber(trimOrNull(registerRequest.getPhoneNumber()));
            user.setRole(role);
            user.setActive(true);
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());

            User savedUser = userRepository.save(user);

            // ✅ Create farmer profile if role is FARMER
            if (roleEnum == UserRole.RoleName.FARMER) {
                FarmerProfile farmerProfile = new FarmerProfile();
                farmerProfile.setUser(savedUser);
                farmerProfileRepository.save(farmerProfile);
            }

            return createAuthResponse(savedUser);

        } catch (Exception e) {
            System.err.println("Error during registration: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }

    public AuthResponse login(LoginRequest loginRequest) {
        if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        if (loginRequest.getPassword() == null || loginRequest.getPassword().isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        try {
            Optional<User> userOptional = userRepository.findByEmailAndActive(
                    loginRequest.getEmail().trim().toLowerCase(), true);

            if (userOptional.isEmpty()) {
                throw new RuntimeException("Invalid email or password");
            }

            User user = userOptional.get();

            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                throw new RuntimeException("Invalid email or password");
            }

            user.setLastLoginDate(new Date());
            userRepository.save(user);

            return createAuthResponse(user);

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Login failed: " + e.getMessage());
        }
    }

    public Long getUserIdByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        return userRepository.findByEmailAndActive(email.trim().toLowerCase(), true)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }


    public void logout(String refreshToken) {
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            throw new RuntimeException("Invalid refresh token");
        }

        validRefreshTokens.remove(refreshToken);
        System.out.println("Logout successful for token: " + refreshToken);
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            throw new RuntimeException("Invalid refresh token");
        }

        try {
            Claims claims = validateJwtToken(refreshToken);

            if (!validRefreshTokens.contains(refreshToken)) {
                throw new RuntimeException("Refresh token not found or expired");
            }

            Long userId = claims.get("userId", Long.class);

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!user.getActive()) {
                throw new RuntimeException("User account is inactive");
            }

            validRefreshTokens.remove(refreshToken);

            return createAuthResponse(user);

        } catch (Exception e) {
            System.err.println("Refresh token error: " + e.getMessage());
            throw new RuntimeException("Invalid refresh token");
        }
    }

    public long getUserCount() {
        return userRepository.count();
    }

    // ===================== JWT Methods =====================

    private String generateAccessToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationTime * 1000);

        return Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .claim("userId", user.getId())
                .claim("username", user.getUsername())
                .claim("email", user.getEmail())
                .claim("role", user.getRole().getRoleName().name())
                .claim("tokenType", "access")
                .signWith(getSigningKey())
                .compact();
    }

    private String generateRefreshToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshTokenExpirationTime * 1000);

        String refreshToken = Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .claim("userId", user.getId())
                .claim("tokenType", "refresh")
                .signWith(getSigningKey())
                .compact();

        validRefreshTokens.add(refreshToken);

        return refreshToken;
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public Claims validateJwtToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("Token has expired");
        } catch (UnsupportedJwtException e) {
            throw new RuntimeException("Unsupported JWT token");
        } catch (MalformedJwtException e) {
            throw new RuntimeException("Invalid JWT token");
        } catch (SignatureException e) {
            throw new RuntimeException("Invalid JWT signature");
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("JWT token compact of handler are invalid");
        }
    }

    public boolean isTokenValid(String token) {
        try {
            validateJwtToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String extractEmailFromToken(String token) {
        Claims claims = validateJwtToken(token);
        return claims.getSubject();
    }

    public Long extractUserIdFromToken(String token) {
        Claims claims = validateJwtToken(token);
        return claims.get("userId", Long.class);
    }

    // ===================== Helpers =====================

    private void validateRegisterRequest(RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new RuntimeException("Username is required");
        }
        if (request.getUsername().length() < 3) {
            throw new RuntimeException("Username must be at least 3 characters long");
        }

        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        if (request.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters long");
        }

        if (request.getRole() == null) {
            throw new RuntimeException("Role is required");
        }
    }

    private AuthResponse createAuthResponse(User user) {
        AuthResponse response = new AuthResponse();
        response.setUserId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().getRoleName().name());
        response.setAccessToken(generateAccessToken(user));
        response.setRefreshToken(generateRefreshToken(user));
        response.setTokenType("Bearer");
        return response;
    }

    private String trimOrNull(String value) {
        return value != null ? value.trim() : null;
    }
}
