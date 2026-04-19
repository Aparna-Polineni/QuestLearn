// src/main/java/com/questlearn/repository/LevelCompletionRepository.java
// Add this method to your existing LevelCompletionRepository interface.
// Spring Data JPA derives the query automatically from the method name.

package com.questlearn.repository;

import com.questlearn.model.LevelCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface LevelCompletionRepository extends JpaRepository<LevelCompletion, Long> {

    // Counts rows WHERE completed_at > :since
    // Spring Data JPA derives this query from the method name — no @Query needed.
    long countByCompletedAtAfter(LocalDateTime since);

    // You may already have other methods here — keep them, just add the above.
}
