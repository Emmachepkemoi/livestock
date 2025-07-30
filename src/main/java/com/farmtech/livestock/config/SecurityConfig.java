package com.farmtech.livestock.config;

import com.farmtech.livestock.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/public/**").permitAll()

                        // ✅ Upload endpoint - match the actual controller path
//                        http://localhost:8080/api/livestock/with-image
                        .requestMatchers("/api/livestock/image/upload").hasAnyAuthority("FARMER", "ADMIN")
                                .requestMatchers("/api/livestock/create").hasAnyAuthority("FARMER", "ADMIN")

                        .requestMatchers("/api/livestock/**").hasAnyAuthority("FARMER", "ADMIN")
                        .requestMatchers("/api/categories/**").hasAnyAuthority("FARMER", "ADMIN")
                        .requestMatchers("/api/health-records/**").hasAnyAuthority("VETERINARIAN", "ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/health-records/**").hasAnyAuthority("VETERINARIAN", "ADMIN", "FARMER")
                        .requestMatchers("/api/breeds/**").hasAnyAuthority("FARMER", "ADMIN")
                        .requestMatchers("/api/livestock/analytics").hasAnyAuthority("FARMER", "ADMIN")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));  // adjust if needed
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
