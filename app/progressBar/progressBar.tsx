import { useEffect, useState } from "react";

const ProgressBar = ({ frase, isProcessing }: {frase: string, isProcessing: boolean}) => {
    const [isLooping, setIsLooping] = useState(false);
    const [isLooping2, setIsLooping2] = useState(false);
    const [isLooping3, setIsLooping3] = useState(false);

    const [progress, setProgress] = useState("")
    const [percent, setPercent] = useState(0)

    useEffect(() => {
        if (progress.length === frase.length) {
            const timeout = setTimeout(() => {
                setIsLooping(true);
            }, 4000);
            const timeout2 = setTimeout(() => {
                setIsLooping2(true);
            }, 350);
            const timeout3 = setTimeout(() => {
                setIsLooping3(true);
            }, 2500);

            return () => {
                clearTimeout(timeout)
                clearTimeout(timeout2)
                clearTimeout(timeout3)
            };
        } else {
            setIsLooping(false);
            setIsLooping2(false);
            setIsLooping3(false);
        }
    }, [progress]);

    useEffect(() => {
        let interval1: string | number | NodeJS.Timeout | undefined;
        let interval2: string | number | NodeJS.Timeout | undefined;

        if (isProcessing) {
            interval1 = setInterval(() => {
                setProgress(prev => {
                    if (prev.length < frase.length) {
                        return frase.slice(0, prev.length + 1);
                    } else {
                        clearInterval(interval1);
                        return prev;
                    }
                });
            }, 50);

            interval2 = setInterval(() => {
                setPercent(prev => {
                    if (prev < 100) {
                        return prev + 1;
                    } else {
                        clearInterval(interval2);
                        return prev;
                    }
                });
            }, 20);
        } else {
            setProgress("");
            setPercent(0);
        }

        return () => {
            if (interval1) clearInterval(interval1);
            if (interval2) clearInterval(interval2);
        };
    }, [isProcessing]);

    return (
        progress != undefined && progress.length > 0 && progress.length <= frase.length &&
        <div className="progress-wrapper">
            <div className="progress-text momo-trust-display-regular">{progress}</div>
            <div className={`water-fill`} style={{ width: `${percent}%`, height: '100%' }}>
                <div className={`wave wave1 ${isLooping ? 'loop' : ''}`}></div>
                <div className={`wave wave2 ${isLooping2 ? 'loop' : ''}`}></div>
                <div className={`wave wave3 ${isLooping3 ? 'loop' : ''}`}></div>
                <div className="bubbles"></div>
            </div>
        </div>
    )
}

export default ProgressBar