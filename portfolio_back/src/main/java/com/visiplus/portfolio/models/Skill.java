package com.visiplus.portfolio.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer level= 1;

    private Boolean isTechnical;

    @Lob
    private String content;
    @Lob
    private String longDescription;
    @Lob
    private String description;

    private String icon;

    @ManyToMany(mappedBy = "skills")
    @JsonIgnore

    private Set<Project> projects;
}
