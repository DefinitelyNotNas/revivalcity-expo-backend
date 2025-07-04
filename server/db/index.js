// // FUNCTIONS
// const fetchFavoritesByUser = async (userId) => {
//   try {
//     const { rows } = await client.query(
//       `
//       SELECT albums.spotify_id, albums.name, albums.artist, albums.image
//       FROM albums
//       INNER JOIN reviews ON albums.id = reviews.album_id
//       WHERE reviews.user_id = $1 AND reviews.favorite = true
//     `,
//       [userId]
//     );
//     return rows;
//   } catch (error) {
//     console.log(error);
//   }
// };