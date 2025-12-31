const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const fetch = require('node-fetch');

// Fetch LeetCode stats
async function fetchLeetCodeStats(username) {
  try {
    const query = `
      query userPublicProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com'
      },
      body: JSON.stringify({
        query,
        variables: { username }
      })
    });

    const data = await response.json();
    
    if (data.errors || !data.data?.matchedUser) {
      throw new Error('User not found or API error');
    }

    const acSubmissions = data.data.matchedUser.submitStats.acSubmissionNum;
    const allProblems = acSubmissions.find(item => item.difficulty === 'All');
    
    return {
      problems_solved: allProblems ? allProblems.count : 0,
      success: true
    };
  } catch (error) {
    console.error('LeetCode API error:', error.message);
    return { problems_solved: null, success: false, error: error.message };
  }
}

// Fetch Codeforces stats
async function fetchCodeforcesStats(username) {
  try {
    const response = await fetch(`https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(data.comment || 'API error');
    }

    // Count unique solved problems
    const solvedProblems = new Set();
    data.result.forEach(submission => {
      if (submission.verdict === 'OK') {
        const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
        solvedProblems.add(problemId);
      }
    });

    return {
      problems_solved: solvedProblems.size,
      success: true
    };
  } catch (error) {
    console.error('Codeforces API error:', error.message);
    return { problems_solved: null, success: false, error: error.message };
  }
}

// Fetch CodeChef stats
async function fetchCodeChefStats(username) {
  try {
    // CodeChef's public API requires authentication
    // Using web scraping approach as fallback
    const response = await fetch(`https://www.codechef.com/users/${username}`);
    const html = await response.text();
    
    // Extract problems solved from HTML
    const match = html.match(/class="rating">(\d+)<\/span>/);
    const problemsMatch = html.match(/Fully\s+Solved[^>]*>(\d+)</i);
    
    if (problemsMatch) {
      return {
        problems_solved: parseInt(problemsMatch[1]),
        success: true
      };
    }
    
    throw new Error('Could not parse CodeChef stats');
  } catch (error) {
    console.error('CodeChef API error:', error.message);
    return { problems_solved: null, success: false, error: error.message };
  }
}

// Get live stats for all platforms
router.get('/live', async (req, res) => {
  try {
    const [platforms] = await pool.query(
      'SELECT * FROM coding_platforms WHERE username IS NOT NULL AND username != "" ORDER BY display_order ASC'
    );

    const liveStats = await Promise.all(
      platforms.map(async (platform) => {
        let liveData = { problems_solved: platform.problems_solved, success: false };

        if (platform.username) {
          const platformName = platform.name.toLowerCase();
          
          if (platformName.includes('leetcode')) {
            liveData = await fetchLeetCodeStats(platform.username);
          } else if (platformName.includes('codeforces')) {
            liveData = await fetchCodeforcesStats(platform.username);
          } else if (platformName.includes('codechef')) {
            liveData = await fetchCodeChefStats(platform.username);
          }
        }

        return {
          ...platform,
          problems_solved: liveData.problems_solved !== null ? liveData.problems_solved : platform.problems_solved,
          is_live: liveData.success,
          fallback_used: !liveData.success
        };
      })
    );

    res.json(liveStats);
  } catch (error) {
    console.error('Get live coding stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get live stats for a specific platform
router.get('/live/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    const [platforms] = await pool.query(
      'SELECT * FROM coding_platforms WHERE LOWER(name) LIKE ? LIMIT 1',
      [`%${platform.toLowerCase()}%`]
    );

    if (platforms.length === 0) {
      return res.status(404).json({ error: 'Platform not found' });
    }

    const platformData = platforms[0];
    let liveData = { problems_solved: platformData.problems_solved, success: false };

    if (platformData.username) {
      const platformName = platformData.name.toLowerCase();
      
      if (platformName.includes('leetcode')) {
        liveData = await fetchLeetCodeStats(platformData.username);
      } else if (platformName.includes('codeforces')) {
        liveData = await fetchCodeforcesStats(platformData.username);
      } else if (platformName.includes('codechef')) {
        liveData = await fetchCodeChefStats(platformData.username);
      }
    }

    res.json({
      ...platformData,
      problems_solved: liveData.problems_solved !== null ? liveData.problems_solved : platformData.problems_solved,
      is_live: liveData.success,
      fallback_used: !liveData.success
    });
  } catch (error) {
    console.error('Get platform live stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
