import React, { useState } from 'react';
import './Style.css'
import { BiSearchAlt } from 'react-icons/bi'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import ImgCanvas from './ImgCanvas';
import axios from 'axios'
import ErrorPage from './ErrorPage';


const Searchpage = () => {
    const [word, setWord] = useState("")
    const [canvasImg, setCanvasImg] = useState("");
    const [error, setError] = useState(
        {
            'status': '',
            'statusText': '',
            'message': '',
        }
    )
    const [imgData, setImgData] = useState([])
    const [loading, setLoading] = useState(false)
    const [imgId, setImgId] = useState('')
    const apiData = "7BKjHVPDALuhnQ8O1NlJDTbkgwf3C7LoEz9aq5iOGNc"

    const HandleSearch = () => {
        setError({
            status: '',
            statusText: '',
            message: ''
        })
        setLoading(true)
        const url = `https://api.unsplash.com/search/photos?page=1&query=${word}&client_id=${apiData}`;
        axios.get(url)
            .then(res => {
                setLoading(false)
                setImgData(res.data.results)
                setError(...error, '')
            })
            .catch((error) => {
                if (error.response) {
                    setLoading(false)
                    setImgData([])
                    setError(
                        {
                            status: error.response.status,
                            statusText: error.response.statusText,
                            message: error.message
                        })
                }
                else {
                    if (error.message === "Network Error") {
                        setError({
                            message: error.message
                        })
                        setImgData([])
                    }
                    setLoading(false)
                }

            })
    }

    const HandleId = (id) => {
        setImgId(id)
        imgData.forEach((curElem) => {
            if (curElem.id === id) {
                setCanvasImg(curElem.urls.regular)
            }
        })
    }


    if (imgId) {


        return <ImgCanvas
            url={canvasImg}
            close={setImgId}
        />
    }
    return (
        <div className='container-fluid back-color'>
            <section className='row header-image-section'>
                <div className="col-md-12">
                    <h1>Image Galary</h1>
                    <div className='search-area'>
                        <label htmlFor='search'>Search images</label>

                        <div className='search-input-group'>
                            <BiSearchAlt size={23} className='react-search-icon' />
                            <input
                                type="text"
                                name='search'
                                id='search'
                                className="form-control"
                                placeholder='Search here'
                                value={word}
                                onChange={(e) => setWord(e.target.value)}
                            />
                            <button onClick={() => HandleSearch()}>Search</button>
                        </div>
                    </div>
                </div>
            </section>
            <section className='container-fluid main-img-section'>
                <div className='row'>
                    {loading ?

                        <div className='container-fluid loding-section'>
                            <div className='loading'>
                                <h1><AiOutlineLoading3Quarters /></h1>
                            </div>
                            <h3>Loading...</h3>
                        </div>
                        :
                        <>
                            {imgData.map((curElem) => {
                                return (
                                    <div key={curElem.id} className='col-md-3'>
                                        <div className='img-card'>
                                            <img src={curElem.urls.regular} alt={curElem.alt_description} />
                                            <button onClick={() => HandleId(curElem.id)}>Add Captions</button>
                                        </div>
                                    </div>
                                )
                            })}
                        </>

                    }
                    {error.message ?
                        <ErrorPage
                            error={error}
                        />
                        : ''}
                </div>
            </section>
        </div>
    );
}

export default Searchpage;
