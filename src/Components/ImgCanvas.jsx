import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric'



const ImgCanvas = ({ close, url }) => {
    const canvasRef = useRef();
    const [canvas, setCanvas] = useState('')
    const [imgUrl, setImgUrl] = useState(url)
    const [caption, setCaption] = useState('')
    const [width, setWidth] = useState();
    const [height, setHeight] = useState();
    const [pos, setPos] = useState([])
    const [finalArray, setFinalArray] = useState({
        image: [],
        rect: [],
        poly: [],
        tri: [],
        circle: [],
    })

    const getCanvasSize = () => {
        const newWidth = canvasRef.current.clientWidth
        setWidth(newWidth - 50)

        const newHeight = canvasRef.current.clientHeight
        setHeight(newHeight - 50)
    }

    useEffect(() => {
        getCanvasSize()
    }, [])
    useEffect(() => {
        window.addEventListener("resize", getCanvasSize);

        return () => {
            window.removeEventListener("resize", getCanvasSize);
        }
    }, [])

  
    useEffect(() => {

        const AddImage = (url, canva) => {

            new fabric.Image.fromURL(url, img => {
                img.scale(0.25)
                canva.add(img)
                canva.renderAll()
                setImgUrl("")
                setFinalArray({ ...finalArray, image: img.getCoords() })
                setPos(pos.concat("image"))
            })
    
        }
        if (imgUrl) {
            AddImage(imgUrl, canvas)
        }
    }, [imgUrl, canvas, pos, finalArray, setFinalArray])

    useEffect(() => {
        const initCanvas = () => (
            new fabric.Canvas('canvas', {
                height: height,
                width: width,
                selection: true
            })
        );
        setCanvas(initCanvas());
    }, [width, height]);



    const HandleCaption = (canva) => {
        const center = canva.getCenter()
        const text = new fabric.IText(caption, {
            width: 450,
            height: 80,
            editable: "true",
            selection: "true",
            cornerColor: "black",
            left: center.left,
            top: center.top,
            originX: 'center',
            originY: 'center',
            fill: "magenta"
        })
        canva.add(text)
        canva.renderAll()
        setFinalArray({ ...finalArray, text: text.getCoords() })
        setPos(pos.concat("text"))

    }

    const HandleCircle = (canva) => {
        const center = canva.getCenter()
        const crcl = new fabric.Circle({
            radius: 100,
            fill: 'blue',
            cornerColor: "black",
            left: center.left,
            top: center.top,
            originX: 'center',
            originY: 'center',
        })
        canva.add(crcl)
        canva.renderAll()
        setPos(pos.concat("circle"))

        setFinalArray({ ...finalArray, circle: crcl.getCoords() })

    }

    const HandleTri = (canva) => {
        const center = canva.getCenter()
        const tri = new fabric.Triangle({
            fill: 'teal',
            height: 300,
            width: 300,
            left: center.left,
            cornerColor: "black",
            top: center.top,
            originX: 'center',
            originY: 'center',
        })
        canva.add(tri)
        canva.renderAll()
        setPos(pos.concat("tri"))

        setFinalArray({ ...finalArray, tri: tri.getCoords() })

    }

    const HandleRect = (canva) => {

        const center = canva.getCenter()
        const rect = new fabric.Rect({
            height: 280,
            width: 400,
            fill: 'green',
            left: center.left,
            cornerColor: "black",
            top: center.top,
            originX: 'center',
            originY: 'center',

        })
        canva.add(rect)
        canva.renderAll()
        setPos(pos.concat("rect"))
        setFinalArray({ ...finalArray, rect: rect.getCoords() })

    }

    const HandlePoly = (canva) => {
        const poly = new fabric.Polygon([
            { x: 400, y: 20 },
            { x: 500, y: 100 },
            { x: 500, y: 360 },
            { x: 300, y: 360 },
            { x: 300, y: 100 }],
            {
                fill: 'crimson',
                cornerColor: "black",

            })
        canva.add(poly)
        canva.renderAll()
        setPos(pos.concat("poly"))

        setFinalArray({ ...finalArray, poly: poly.getCoords() })
    }

    const HandleDownload = (canva) => {

        const img = canva.toDataURL('image/png');
        const link = document.createElement('a')
        link.href = img;
        link.download = 'image.png';
        link.click()
    }
    const ConsoleData = () => {
        if (pos) {
            for (var x in pos) {
                console.log(pos[x], " => ", finalArray[pos[x]])
            }
        }
    }

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-12 heading-canvas'>
                    <h1>Your Canvas</h1>
                </div>
                <div className='col-md-9 canvas-card' ref={canvasRef}>
                    {(height && width) ?
                        <div className='canvas-section' style={{ height: height + 50, width: width + 40 }} >
                            <canvas id="canvas" />
                        </div>
                        : ''}
                </div>

                <div className="col-md-3">
                    <div className='edit-menu'>
                        <h3>Edit Canvas</h3>
                        <hr className='hrline' />
                        <div className='caption-box button-dec'>
                            <textarea
                                type="text"
                                className='form-control'
                                placeholder='Add caption here'
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                            />
                            <button onClick={() => HandleCaption(canvas)}>Add Captions</button>
                        </div>

                        <div className='shapes '>
                            <h4>Add Shapes</h4>
                            <div className='btnGrp button-dec'>
                                <button onClick={() => HandleTri(canvas)}>Triangle</button>
                                <button onClick={() => HandleCircle(canvas)}>Circle</button>
                            </div>
                            <div className='btnGrp button-dec'>
                                <button onClick={() => HandleRect(canvas)}>Rectangle</button>
                                <button onClick={() => HandlePoly(canvas)}>Polygon</button>
                            </div>

                        </div>
                    </div>
                    <div className='download'>
                        <h2>Download</h2>
                        <hr className='hrline' />
                        <div className='action-button'>
                            <button className="btn1" onClick={() => HandleDownload(canvas)}> Download</button>
                            <button className="btn2" onClick={() => close("")}>Back</button>

                        </div>
                    </div>
                    <div className='download action-button'>
                        <button className='' onClick={ConsoleData}>Position</button>

                    </div>
                </div>
            </div>

        </div >
    );
}

export default ImgCanvas;
