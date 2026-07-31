package com.visiplus.portfolio.services;

import com.visiplus.portfolio.models.Article;

import java.util.List;

public interface ArticleService {
    List<Article> findAllActive();
    List<Article> findAll();
    Article create(Article article);
    Article update(String slug, Article article);
    Article findBySlug(String slug);
    void delete(String slug);
}
