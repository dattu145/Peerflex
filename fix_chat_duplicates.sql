-- Function to find existing private chat room
CREATE OR REPLACE FUNCTION get_private_chat_room(user1_id uuid, user2_id uuid)
RETURNS SETOF chat_rooms AS $$
BEGIN
  RETURN QUERY
  SELECT cr.*
  FROM chat_rooms cr
  JOIN chat_members cm1 ON cr.id = cm1.chat_room_id
  JOIN chat_members cm2 ON cr.id = cm2.chat_room_id
  WHERE cr.is_group = false
  AND cm1.user_id = user1_id
  AND cm2.user_id = user2_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup duplicate rooms
DO $$
DECLARE
  r RECORD;
  keep_id uuid;
BEGIN
  -- Iterate over pairs of users with multiple private rooms
  FOR r IN 
    SELECT 
      least(cm1.user_id, cm2.user_id) as u1, 
      greatest(cm1.user_id, cm2.user_id) as u2,
      count(DISTINCT cr.id) as room_count,
      array_agg(DISTINCT cr.id) as room_ids
    FROM chat_rooms cr
    JOIN chat_members cm1 ON cr.id = cm1.chat_room_id
    JOIN chat_members cm2 ON cr.id = cm2.chat_room_id
    WHERE cr.is_group = false
    AND cm1.user_id != cm2.user_id
    GROUP BY least(cm1.user_id, cm2.user_id), greatest(cm1.user_id, cm2.user_id)
    HAVING count(DISTINCT cr.id) > 1
  LOOP
    -- Keep the first room (or the one with most messages if we wanted to be fancy, but simple is safer)
    keep_id := r.room_ids[1];
    
    -- Delete other rooms
    DELETE FROM chat_rooms 
    WHERE id = ANY(r.room_ids) 
    AND id != keep_id;
    
    RAISE NOTICE 'Cleaned up duplicates for users % and %. Kept room %', r.u1, r.u2, keep_id;
  END LOOP;
END $$;
