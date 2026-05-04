import styles from 'src/shared/styles/Post.module.css'

export function Post({ title, username, body, comments }) {
    return (
        <>
            <div className={styles.container}>
                <div className={styles.titleContainer}>
                    <span className={`${styles.title} text white`}>{ title }</span>
                    <span className={`${styles.author} text`}>By: { username }</span>
                </div>
                <div className={`${styles.body} text`}>{ body }</div>
                <ul className={styles.mainCommentContainer}>
                    <p className={`${styles.commentTitle} text`}>Comments</p>
                    { comments ? comments.map((comment) => {
                        return (
                            <li key={comment.id} className={styles.commentContainer}>
                                <p className={`${styles.commentAuthor} text`}>@{comment.author}</p>
                                <p className={`${styles.commentBody} text`}>{comment.body}</p>
                            </li>
                        )
                    }) : <div>loading..</div>}
                </ul>
            </div>
        </>
    )
}

export default Post