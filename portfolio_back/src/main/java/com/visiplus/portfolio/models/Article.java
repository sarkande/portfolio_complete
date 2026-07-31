package com.visiplus.portfolio.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true)
    private String slug;

    private String title;

    @Lob
    private String excerpt;

    @Lob
    private String content;

    private String publishedDate;

    @ElementCollection
    private List<String> tags;

    private String relatedProjectSlug;

    private String thumbnailUrl;

    private boolean active;
}
