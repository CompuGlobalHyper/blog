import { redirect } from "react-router-dom";
import { compareDesc, format } from "date-fns";

export const authUser = async () => {
  const res = await fetch("http://localhost:3000/me", {
    method: "GET",
    credentials: "include",
  });

  if (res.status === 401) {
    throw redirect("/login");
  }

  return res.json();
};

export const fetchPosts = async () => {
    const res = await fetch("http://localhost:3000/home", {
        metod: "GET",
        credentials: 'include'
    })
    const data = await res.json()
    const posts = sortPosts(data.postsWithUsers)
    return posts
}
export const fetchUniquePost = async (id) => {
    const res = await fetch(`http://localhost:3000/view/${id}`, {
        method: "GET",
        credentials: "include"
    })
    const data = await res.json()
    return { post: data.post, comments: data.comments }
}

export async function adminAccess() {
  const res = await fetch("http://localhost:3000/admin", {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json()
  return data.postsWithUsers
}

export const formatDate = (dateString) => {
  return format(
      new Date(dateString.replace(" ", "T")),
          "EEEE MMMM d yyyy"
  );
};
export const sortPosts = (posts) => {
  const newPosts = [...posts].sort((a, b) => {
      return compareDesc(new Date(a.createdAt), new Date(b.createdAt))
  })
  return newPosts
  
}

export default { authUser, fetchPosts, fetchUniquePost, adminAccess, sortPosts, formatDate }
