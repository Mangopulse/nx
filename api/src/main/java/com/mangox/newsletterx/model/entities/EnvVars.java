package com.mangox.newsletterx.model.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "variables")
@NoArgsConstructor
public class EnvVars {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String key;
    String value;

}
