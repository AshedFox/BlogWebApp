import React, {FC} from 'react';
import styles from "./Mark.module.css"

type MarkProps = {
    totalMark: number;
    isVotable: boolean;
    handleVote?: (value: number) => void;
}

const Mark: FC<MarkProps> = ({totalMark, isVotable, handleVote}) => {
    return (
        <div className={styles.container}>
            {isVotable && <div className={styles.minus} onClick={() => handleVote?.(-1)}/>}
            <div className={styles.mark}>
                <div className={styles.star}/>
                <div className={`${styles.text} ${totalMark === 0 ? "" : totalMark > 0 ? styles.positive : styles.negative}`}>
                    {totalMark === 0 ? totalMark : totalMark > 0 ? "+" + totalMark : "-" + totalMark}
                </div>
            </div>
            {isVotable && <div className={styles.plus} onClick={() => handleVote?.(1)}/>}
        </div>
    );
};

export default Mark;