package com.visiplus.portfolio.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true)
    private String slug;

    private String title;

    @Lob
    private String description;

    private String startDate;
    private String endDate;

    @ElementCollection
    private List<String> technologies;

    @ElementCollection
    private List<String> tags;

    @ManyToMany(cascade = { CascadeType.MERGE })
    @JoinTable(
            name = "project_skill",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private Set<Skill> skills = new HashSet<>() ;

    private String category;

    private String thumbnailUrl;

    @ElementCollection
    private List<String> gallery;

    private String gitUrl;
    private String liveUrl;

    private String role;

    private boolean isFeatured;
    private boolean active;
    private boolean old;

    @Lob
    private String content;

    @Lob
    private String longDescription;
}
