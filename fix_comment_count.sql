-- Function to update comment count
CREATE OR REPLACE FUNCTION update_note_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE notes
    SET comment_count = comment_count + 1
    WHERE id = NEW.note_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE notes
    SET comment_count = comment_count - 1
    WHERE id = OLD.note_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS update_note_comment_count_trigger ON note_comments;
CREATE TRIGGER update_note_comment_count_trigger
AFTER INSERT OR DELETE ON note_comments
FOR EACH ROW
EXECUTE FUNCTION update_note_comment_count();

-- Recalculate existing counts to fix current data
UPDATE notes n
SET comment_count = (
  SELECT count(*)
  FROM note_comments nc
  WHERE nc.note_id = n.id
);
