import React, {FC, useEffect, useState} from 'react';
import styles from "./Mark.module.css"
import {observer} from "mobx-react";
import {useAccountStore} from "../../store/AccountStore";
import {PostMarkModel} from "../../models/PostMarkModel";
import {CommentMarkModel} from "../../models/CommentMarkModel";

export enum MarkViewType {
    OnlyArrows,
    OnlyCurrentVoteArrow,
    OnlyTotal,
    All
}

type DefaultProps = {
    userToCheckMarkId?: string
    marks: PostMarkModel[] | CommentMarkModel[]
}

type OptionalProps = | { 
    isVotable: true, viewType?: never,
    handleMark: (vote:number) => void, handleUnmark: () => void, handleChangeMark: (vote:number) => void 
} 
| { 
    isVotable: false, viewType: MarkViewType
    handleMark?: never, handleUnmark?: never, handleChangeMark?: never 
}

type MarkProps = DefaultProps & OptionalProps;

const Mark: FC<MarkProps> = (props) => {
    const {account} = useAccountStore();
    const {marks, userToCheckMarkId, isVotable, viewType, handleMark, handleChangeMark, handleUnmark} = props;
    const [totalMark, setTotalMark] = useState(0);
    const [currentMark, setCurrentMark] = useState<number>();
    
    useEffect(() => {
        countTotalMark();
        checkIfVoted();
    }, [marks])

    const countTotalMark = () => {
        let currentMark = 0;

        marks.forEach((mark) => {
            if (mark.value === 0) {
                currentMark--;
            }
            else if (mark.value === 1) {
                currentMark++;
            }
        })

        setTotalMark(currentMark);
    }
    
    const checkIfVoted = () => {
        let newCurrentMark = undefined;
        
        if (userToCheckMarkId) {
            marks.forEach(mark => {
                if (mark.userId === userToCheckMarkId) {
                    newCurrentMark = mark.value;
                }
            });
        }
        else if (account) {
            marks.forEach(mark => {
                if (mark.userId === account.userId) {
                    newCurrentMark = mark.value;
                }
            });
        }
        
        setCurrentMark(newCurrentMark);
    }
    
    const handleVote = (voteValue: number) => {
        if (isVotable) {
            if (currentMark !== undefined) {
                if (currentMark === voteValue) {
                    handleUnmark!();
                }
                else {
                    handleChangeMark!(voteValue);
                }
            }
            else {
                handleMark!(voteValue);
            }
        }
    }
    
    const renderMinusArrow = () => {
        if (isVotable){
            return <div className={`${styles.minus} ${currentMark === 0 ? styles.voted : ""}`} onClick={() => handleVote(0)}/>;
        }
        else {
            if (viewType === MarkViewType.OnlyArrows || viewType === MarkViewType.All) {
                return <div className={`${styles.minus} ${currentMark === 0 ? styles.voted : ""}`}/>;
            }
            else if (viewType === MarkViewType.OnlyCurrentVoteArrow && currentMark === 0) {
                return <div className={`${styles.minus} ${styles.voted}`}/>;
            }
        }
        
        return <></>
    }
    
    const renderPlusArrow = () => {
        if (isVotable) {
            return <div className={`${styles.plus} ${currentMark === 1 ? styles.voted : ""}`} onClick={() => handleVote(1)}/>
        }
        else {
            if (viewType === MarkViewType.OnlyArrows || viewType === MarkViewType.All) {
                return <div className={`${styles.plus} ${currentMark === 1 ? styles.voted : ""}`}/>
            }
            else if (viewType === MarkViewType.OnlyCurrentVoteArrow && currentMark === 1) {
                return <div className={`${styles.plus} ${styles.voted}`}/>
            }
        }
        
        return <></>
    }
    
    const renderTotalMark = () => {
        if (isVotable || viewType === MarkViewType.OnlyTotal || viewType === MarkViewType.All) {
            return <div className={styles.mark} title={`Всего оценок: ${marks.length}`}>
                <div className={styles.star}/>
                <div className={styles.text}>{totalMark}</div>
            </div>;
        }
    }
    
    return (
        <div className={styles.container}>
            {renderMinusArrow()}
            {renderTotalMark()}
            {renderPlusArrow()}
        </div>
    );
};

export default observer(Mark);