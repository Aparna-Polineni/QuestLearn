package com.questlearn.service;

import com.questlearn.dto.LeaderboardEntry;
import com.questlearn.entity.User;
import com.questlearn.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final UserRepository userRepository;

    /** Top 50 users by totalXp — rank is computed in memory after the query */
    public List<LeaderboardEntry> getTopPlayers(int limit) {
        AtomicInteger rank = new AtomicInteger(1);

        return userRepository.findTopByXp(Math.min(limit, 50)).stream()
                .map(u -> new LeaderboardEntry(
                        rank.getAndIncrement(),
                        u.getDisplayName(),
                        u.getTotalXp(),
                        u.getCurrentStage()
                ))
                .toList();
    }
}
