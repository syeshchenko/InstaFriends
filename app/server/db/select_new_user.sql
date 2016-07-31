SELECT 
   user.id
FROM
   users AS user
WHERE
   NOT EXISTS 
      ( SELECT * 
        FROM user_follows AS follower
        WHERE follower.users_id = user.id 
          AND follower.shown_users_id = 2
      )
AND
   NOT EXISTS 
      ( SELECT * 
        FROM user_follows AS followed
        WHERE followed.shown_users_id = user.id 
          AND followed.users_id = 2
      ) 
AND
   user.id <> 2 
LIMIT 1;