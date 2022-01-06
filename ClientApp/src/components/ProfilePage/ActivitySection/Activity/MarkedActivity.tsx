import React from 'react';
import Mark, {MarkViewType} from "../../../Mark/Mark";
import {CommentMarkModel} from "../../../../models/CommentMarkModel";
import {PostMarkModel} from "../../../../models/PostMarkModel";
import styles from "./Activity.module.css";
import { Link } from 'react-router-dom';
import {routes} from "../../../../constants/routes";

type Props = {
    mark: CommentMarkModel|PostMarkModel,
}

const MarkedActivity = ({mark}:Props) => {
    return (
        <div className={styles.container}>
            <div className={styles.props}>
                {"post" in mark ?
                    <Link className={styles.title} to={`${routes.post}/${mark.post.id}`}>{mark.post.title}</Link> :
                    <>
                        <Link className={styles.title} to={`${routes.post}/${mark.comment.post.id}`}>
                            {`К статье ${mark.comment.post.title}`}
                        </Link>
                        <div className={styles.content}>
                            {mark.comment.content.length > 100 ?
                                mark.comment.content.substr(0,100) + "..." : 
                                mark.comment.content
                            }
                        </div>
                    </>
                }
            </div>
            <Mark marks={[mark] as PostMarkModel[] | CommentMarkModel[]} isVotable={false} 
                  viewType={MarkViewType.OnlyCurrentVoteArrow} userToCheckMarkId={mark.userId}
            />
        </div>
    );
};

export default MarkedActivity;