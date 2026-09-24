import React, { createElement, useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { Button, Slider, TextField, Typography } from "@mui/material";
import { FaCodepen } from "react-icons/fa";
import { FiArrowUp, FiCoffee, FiFacebook, FiGithub, FiGlobe, FiHeart, FiLinkedin, FiMail, FiSave, FiStar, FiTrash2, FiYoutube } from "react-icons/fi";

const links = [
    ["Portfolio", "https://www.ashishranjan.net/", FiGlobe],
    ["GitHub", "https://github.com/a2rp", FiGithub],
    ["CodePen", "https://codepen.io/ash1198", FaCodepen],
    ["LinkedIn", "https://www.linkedin.com/in/aashishranjan", FiLinkedin],
    ["Facebook", "https://www.facebook.com/theash.ashish/", FiFacebook],
    ["YouTube", "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", FiYoutube],
    ["Email", "mailto:ash.ranjan09@gmail.com", FiMail],
];

const support = [
    ["Support", "https://a2rp-donation-page.netlify.app/", FiHeart],
    ["Buy Me a Coffee", "https://buymeacoffee.com/a2rp", FiCoffee],
    ["Patreon", "https://patreon.com/a2rp", FiStar],
];

function IconLinks({ items }) {
    return (
        <div className={styles.iconLinks}>
            {items.map(([label, href, Icon]) => (
                <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} aria-label={label} title={label}>
                    {createElement(Icon)}
                </a>
            ))}
        </div>
    );
}

function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.headerInner}>
                <a className={styles.brand} href="/paint-web-application/" aria-label="Paint application home">
                    <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Ashish Ranjan logo" />
                    <span>Paint Studio</span>
                </a>
                <span className={styles.headerHint}>Draw, clear and save your canvas</span>
            </div>
        </header>
    );
}

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerIntro}>
                <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Ashish Ranjan logo" />
                <div><strong>Paint Studio</strong><span>A lightweight browser canvas</span></div>
            </div>
            <div className={styles.footerGroups}>
                <div><span>Links</span><IconLinks items={links} /></div>
                <div><span>Support</span><IconLinks items={support} /></div>
            </div>
            <div className={styles.footerBottom}>
                Copyright &copy; {new Date().getFullYear()} {" "}
                <a href="https://www.ashishranjan.net/" target="_blank" rel="noopener noreferrer">Ashish Ranjan</a>
                <span>|</span>
                <a href="https://github.com/a2rp/paint-web-application" target="_blank" rel="noopener noreferrer">Repository</a>
            </div>
        </footer>
    );
}

function GoToTop({ targetRef }) {
    const [show, setShow] = useState(false);
    useEffect(() => {
        const node = targetRef.current;
        if (!node) return undefined;
        const onScroll = () => setShow(node.scrollTop > 240);
        node.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => node.removeEventListener("scroll", onScroll);
    }, [targetRef]);
    return (
        <button className={`${styles.goTop} ${show ? styles.goTopVisible : ""}`} type="button" onClick={() => targetRef.current?.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Go to top" title="Go to top">
            <FiArrowUp />
        </button>
    );
}

const PaintApp = () => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const mainRef = useRef(null);
    const isDrawingRef = useRef(false);
    const [brushColor, setBrushColor] = useState("#000000");
    const [brushWidth, setBrushWidth] = useState(5);
    const [brushOpacity, setBrushOpacity] = useState(0.1);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;
        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            const ratio = window.devicePixelRatio || 1;
            canvas.width = Math.max(1, Math.floor(rect.width * ratio));
            canvas.height = Math.max(1, Math.floor(rect.height * ratio));
            const context = canvas.getContext("2d");
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            context.lineCap = "round";
            context.lineJoin = "round";
            contextRef.current = context;
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        return () => window.removeEventListener("resize", resizeCanvas);
    }, []);

    useEffect(() => {
        const context = contextRef.current;
        if (!context) return;
        context.globalAlpha = brushOpacity;
        context.strokeStyle = brushColor;
        context.lineWidth = brushWidth;
    }, [brushColor, brushOpacity, brushWidth]);

    const getPoint = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const handlePointerDown = (event) => {
        const context = contextRef.current;
        if (!context) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        const point = getPoint(event);
        context.beginPath();
        context.moveTo(point.x, point.y);
        isDrawingRef.current = true;
    };

    const handlePointerMove = (event) => {
        if (!isDrawingRef.current || !contextRef.current) return;
        const point = getPoint(event);
        contextRef.current.lineTo(point.x, point.y);
        contextRef.current.stroke();
    };

    const handlePointerUp = () => {
        contextRef.current?.closePath();
        isDrawingRef.current = false;
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        if (!canvas || !context) return;
        const rect = canvas.getBoundingClientRect();
        context.clearRect(0, 0, rect.width, rect.height);
    };

    const saveAsImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement("a");
        link.download = "paint-studio-canvas.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    return (
        <div className={styles.container} ref={mainRef}>
            <Header />
            <main className={styles.main}>
                <section className={styles.headingBlock}>
                    <p className={styles.eyebrow}>BROWSER CANVAS</p>
                    <h1>Paint something simple.</h1>
                    <p>Choose a color, adjust the brush and create a quick sketch directly in your browser.</p>
                </section>

                <section className={styles.workspace} aria-label="Paint controls and canvas">
                    <div className={styles.menuContainer}>
                        <TextField value={brushColor} onChange={(event) => setBrushColor(event.target.value)} type="color" label="Brush color" className={styles.brushColor} InputLabelProps={{ shrink: true }} />
                        <div className={styles.sliderContainer}>
                            <Typography>Brush width: {brushWidth}px</Typography>
                            <Slider aria-label="Brush width" value={brushWidth} min={1} max={50} step={1} onChange={(_, value) => setBrushWidth(value)} valueLabelDisplay="auto" />
                        </div>
                        <div className={styles.sliderContainer}>
                            <Typography>Brush opacity: {brushOpacity}</Typography>
                            <Slider aria-label="Brush opacity" value={brushOpacity} min={0.01} max={1} step={0.01} onChange={(_, value) => setBrushOpacity(value)} valueLabelDisplay="auto" />
                        </div>
                        <div className={styles.actions}>
                            <Button onClick={clearCanvas} variant="outlined" startIcon={<FiTrash2 />}>Clear</Button>
                            <Button onClick={saveAsImage} variant="contained" startIcon={<FiSave />}>Save</Button>
                        </div>
                    </div>
                    <div className={styles.canvasFrame}>
                        <canvas ref={canvasRef} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} className={styles.canvas} aria-label="Paint canvas" />
                    </div>
                </section>
            </main>
            <Footer />
            <GoToTop targetRef={mainRef} />
        </div>
    );
};

export default PaintApp;