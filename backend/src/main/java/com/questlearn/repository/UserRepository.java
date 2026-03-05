package com.questlearn.repository;

import com.questlearn.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    /** Top N users by totalXp — used by the leaderboard endpoint */
    @Query("SELECT u FROM User u ORDER BY u.totalXp DESC LIMIT :limit")
    List<User> findTopByXp(int limit);
}
