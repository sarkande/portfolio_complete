package com.visiplus.portfolio.repository;

import com.visiplus.portfolio.models.Article;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ArticleRepository extends JpaRepository<Article, Integer> {
    Optional<Article> findBySlug(String slug);
    List<Article> findAllByActiveTrue();
}
