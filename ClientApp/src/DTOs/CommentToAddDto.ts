export interface CommentToAddDto {
    postId: string,
    creatorId: string
    parentCommentId?: string,
    content: string
}