import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { Button, Slider, TextField, Typography } from "@mui/material";

const PaintApp = () => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    const [first, setFirst] = useState(false);

    const [brushColor, setBrushColor] = useState("#000000");
    const [brushColorLabel, setBrushColorLabel] = useState("Brush color: " + brushColor);

    const [brushWidth, setBrushWidth] = useState(5);
    const [brushWidthLabel, setBrushWidthLabel] = useState("Brush width - " + brushWidth);

    const [brushOpacity, setBrushOpacity] = useState(0.1);
    const [brushOpacityLabel, setBrushOpacityLabel] = useState("Brush Opacity - " + brushOpacity);

    const [isDrawing, setIsDrawing] = useState(false);

    const handleBrushColorChange = (event) => {
        const value = event.target.value;
        setBrushColor(value);
        setBrushColorLabel("Brush color: " + value);
    };

    const handleBrushWidthChange = (event) => {
        const value = event.target.value;
        setBrushWidth(value);
        setBrushWidthLabel("Brush width: " + value);
    };

    const handleBrushOpacityChange = (event) => {
        const value = event.target.value;
        setBrushOpacity(value);
        setBrushOpacityLabel("Brush opacity: " + value);
    };

    function valuetext(value) {
        return `Brudh width - ${value}`;
    }

    const init = () => {
        const canvas = canvasRef.current;
        if (first === false) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            setFirst(true);
        }
        const context = canvas.getContext("2d");
        context.lineCap = "round";
        context.lineJoin = "round";
        context.globalAlpha = brushOpacity;
        context.strokeStyle = brushColor;
        context.lineWidth = brushWidth;
        contextRef.current = context;
    };

    useEffect(() => {
        init();
        window.addEventListener("resize", () => {
            setFirst(false);
            init();
        });
    }, [brushColor, brushWidth, brushOpacity]);

    useEffect(() => {
        console.log(window.innerWidth);
    }, [window.innerWidth]);

    const handleMouseDown = (event) => {
        contextRef.current.beginPath();
        contextRef.current.moveTo(
            event.nativeEvent.offsetX,
            event.nativeEvent.offsetY
        );
        setIsDrawing(true);
    };

    const handleMouseUp = (event) => {
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    const handleMouseMove = (event) => {
        if (!isDrawing) {
            return;
        }
        contextRef.current.lineTo(
            event.nativeEvent.offsetX,
            event.nativeEvent.offsetY
        );
        contextRef.current.stroke();
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        // contextRef.current = context;
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    const saveAsImage = () => {
        let canvas = canvasRef.current;
        let url = canvas.toDataURL("image/png");
        let link = document.createElement("a");
        link.download = "canvas-image.png";
        link.href = url;
        link.click();
    };

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <div className={styles.heading}>Paint Application</div>
                <div className={styles.menuContainer}>
                    <TextField
                        value={brushColor}
                        onChange={handleBrushColorChange}
                        type="color"
                        label={brushColorLabel}
                        className={styles.brushColor}
                    />

                    <div className={styles.brushWidthContainer}>
                        <Typography>{brushWidthLabel}</Typography>
                        <Slider
                            aria-label="Brush width"
                            defaultValue={3}
                            getAriaValueText={valuetext}
                            valueLabelDisplay="auto"
                            shiftStep={3}
                            step={1}
                            marks
                            min={1}
                            max={50}
                            label={brushWidthLabel}
                            value={brushWidth}
                            onChange={handleBrushWidthChange}
                        />
                    </div>

                    <div className={styles.brushOpacityContainer}>
                        <Typography>{brushOpacityLabel}</Typography>
                        <Slider
                            aria-label="Brush Opacity"
                            defaultValue={3}
                            getAriaValueText={valuetext}
                            valueLabelDisplay="auto"
                            shiftStep={3}
                            marks
                            min={0.001}
                            max={0.1}
                            step={0.001}
                            label={brushOpacityLabel}
                            value={brushOpacity}
                            onChange={handleBrushOpacityChange}
                        />
                    </div>

                    <Button
                        onClick={clearCanvas}
                        variant="contained"
                        className={styles.clearButton}
                    >Clear</Button>

                    <Button
                        onClick={saveAsImage}
                        variant="contained"
                        className={styles.saveAsImage}
                    >Save</Button>
                </div>

                <canvas
                    ref={canvasRef}
                    onMouseUp={handleMouseUp}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    className={styles.canvas}
                ></canvas>
            </div>
        </div>
    )
}

export default PaintApp


