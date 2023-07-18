// src/routes/notes/destroyNote.jsx
export async function action({ params }) {
  const response = await fetch(`/api/comments/${params.commentId}`, {
    method: "DELETE",
  });
  return null;
}