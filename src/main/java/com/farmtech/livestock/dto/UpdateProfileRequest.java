package com.farmtech.livestock.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Getter
@Setter
public class UpdateProfileRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50)
    private String lastName;

    @Size(min = 10, max = 15)
    private String phoneNumber;

    // Optional field for password confirmation (if updating password)
    private String confirmPassword;

    // These fields are typically set by the system, not by user input
    // You might want to remove these from the request DTO
    private Date createdAt;
    private Date lastLoginDate;

    // Constructors
    public UpdateProfileRequest() {}

    public UpdateProfileRequest(String username, String email, String firstName, String lastName, String phoneNumber) {
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
    }
}