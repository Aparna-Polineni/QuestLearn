package com.questlearn.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

/**
 * Core user entity — stored in the 'users' table.
 * Implements UserDetails so Spring Security can use it directly
 * in the authentication filter chain.
 */
@Entity
@Table(name = "users")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String displayName;

    /** Stored as bcrypt hash — NEVER plain text */
    @Column(nullable = false)
    private String password;

    /** e.g. "healthcare", "fintech", "ecommerce", "gaming", "startup" */
    private String careerPath;

    /** The specific domain the user chose within their career path */
    private String domainName;

    /** Hex colour stored so the React UI can restore domain theming */
    private String domainColor;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalXp = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer currentStage = 1;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime lastActiveAt = LocalDateTime.now();

    // ── UserDetails ─────────────────────────────────────────────────────────
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    /** Spring Security uses email as the unique login identifier */
    @Override public String getUsername()               { return email; }
    @Override public boolean isAccountNonExpired()      { return true; }
    @Override public boolean isAccountNonLocked()       { return true; }
    @Override public boolean isCredentialsNonExpired()  { return true; }
    @Override public boolean isEnabled()                { return true; }
}
