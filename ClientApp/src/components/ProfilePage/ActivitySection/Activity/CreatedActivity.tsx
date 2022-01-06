import React from 'react';
import {PostModel} from "../../../../models/PostModel";
import Mark, {MarkViewType} from "../../../Mark/Mark";
import {CommentModel} from "../../../../models/CommentModel";
import styles from "./Activity.module.css";
import {routes} from "../../../../constants/routes";
import { Link } from 'react-router-dom';

type Props = {
    item: PostModel|CommentModel,
}

const CreatedActivity = ({item}:Props) => {
    return (
        <div className={styles.container}>
            <div className={styles.props}>
                {"title" in item ?
                    <Link className={styles.title} to={`${routes.post}/${item.id}`}>{item.title}</Link> :
                    <>
                        <Link className={styles.title} to={`${routes.post}/${item.post.id}`}>К статье {item.post.title}</Link>
                        <div className={styles.content}>
                            {item.content.length > 100 ?
                                item.content.substr(0, 100) + "..." :
                                item.content
                            }
                        </div>
                    </>
                }
            </div>
            <Mark marks={item.marks} isVotable={false} viewType={MarkViewType.OnlyTotal}/>
        </div>
    );
};

export default CreatedActivity;