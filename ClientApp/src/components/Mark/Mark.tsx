import React, {FC, useEffect, useState} from 'react';
import styles from "./Mark.module.css"
import {observer} from "mobx-react";
import {useAccountStore} from "../../store/AccountStore";
import {PostMarkModel} from "../../models/PostMarkModel";
import {CommentMarkModel} from "../../models/CommentMarkModel";


type DefaultProps = {
    marks: PostMarkModel[] | CommentMarkModel[]
}

type OptionalProps = 
    | { isVotable: true, handleMark: (vote:number) => void, handleUnmark: () => void, handleChangeMark: (vote:number) => void }
    | { isVotable: false, handleMark?: never, handleUnmark?: never, handleChangeMark?: never }

type MarkProps = DefaultProps & OptionalProps;

const Mark: FC<MarkProps> = ({marks, isVotable, handleMark, 
                                 handleChangeMark, handleUnmark}) => 
{
    const {account} = useAccountStore();
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
        
        if (account) {
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
    
    return (
        <div className={styles.container}>
            {isVotable && 
                <div className={`${styles.minus} ${currentMark === 0 ? styles.voted : ""}`} onClick={() => handleVote(0)}/>
            }
            <div className={styles.mark} title={`Всего оценок: ${marks.length}`}>
                <div className={styles.star}/>
                <div className={styles.text}>{totalMark}</div>
            </div>
            {isVotable && 
                <div className={`${styles.plus} ${currentMark === 1 ? styles.voted : ""}`} onClick={() => handleVote(1)}/>}
        </div>
    );
};

export default observer(Mark);