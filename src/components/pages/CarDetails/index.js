import { useEffect, useRef, useState } from 'react'
import FetchApi from '../../../constants/FetchApi'
import './index.modul.css'
import CustomButton from '../../Element/CustomButton'
import AppConfig from '../../../constants/AppConfig'

import PageLoader from '../../PageLoader'
import Cookies from 'js-cookie'

const CarDetails = () => {
    const [myCarDetails, setMyCarDetails] = useState({})
    const [isError, setIsError] = useState(false)
    const [from, setFrom] = useState("")
    const [pickupDate, setPickupDate] = useState("")
    const [dropupDate, setDropupDate] = useState("")
    const [pickupTime, setPickupTime] = useState("")
    const [dropupTime, setDropupTime] = useState("")
    const pRef = useRef(null);
    const DOMAIN = AppConfig.SUB_DOMAIN
    const BASE_URL = AppConfig.BASE_URL
    const [errorFrom, setErrorFrom] = useState("");
    const [errorPickup, setErrorPickup] = useState("");
    const [errorDropDate, setErrorDropDate] = useState("");
    const [times, setTimes] = useState("")
    const todays = new Date().toJSON().slice(0, 10);
    const [currentImage, setCurrentImage] = useState('');

    function sliderGallery(smallImg) {
        setCurrentImage(smallImg);
    }
    // console.log("today date", times);
    // setToday(todays);

    let isAllData = true;
    var url_string = window.location;// it is get current page url
    var url = new URL(url_string);
    var myCarKey = url.searchParams.get("item_key");
    // console.log("my car key", myCarKey)
    const handlerDisplayOneCarDetails = async () => {
        if (myCarKey) {
            const data = await FetchApi("/display-carlist?item_id=" + myCarKey, "", {
                method: "GET"
            })
            setMyCarDetails(data)
        } else {
            setIsError(true)
        }


    }
    // console.log("my image here == > ", myCarDetails.registerYear);
    const dateString = myCarDetails.registerYear
    const makeYear = myCarDetails.makeYear
    const carRating = myCarDetails.schedule ? myCarDetails.schedule : "";

    const formatDate = new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const makeDate = new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const inputFrom = (e) => {
        const value = e.target.value;
        setFrom(value)
        if (value) {
            setErrorFrom("")
        }
    }
    const inputPickupDate = (e) => {
        const value = e.target.value;
        setPickupDate(value)
        if (value) {
            setErrorPickup("")
        }
    }
    const inputDropupDate = (e) => {
        const value = e.target.value;
        setDropupDate(value)
        if (value) {
            setErrorDropDate("")
        }
    }
    // const inputtime = (e) => {
    //     const value = e.target.value;
    //     setTimes(value)
    //     if (value) {
    //         setErrorDate("")
    //     }
    // }

    const handlarCarBooking = async () => {
        try {
            if (from) {
                setErrorFrom("")
            } else {
                setErrorFrom("Error:  Enter location")
                isAllData = false;
            }
            // if (date) {
            //     setErrorDate("")
            // } else {
            //     setErrorDate("Error: Pickaup date & Time")
            //     isAllData = false;
            // }
            if (pickupDate) {
                setErrorPickup("")
            } else {
                setErrorPickup("Error: Enter Pickup Date & Time");
                isAllData = false;
            }
            if (dropupDate) {
                setErrorDropDate("")
            } else {
                setErrorDropDate("Error: Enter Dropup Date & Time")
                isAllData = false;
            }
            if (isAllData === true && carRating) {
                if (pRef.current) {
                    const Date1 = new Date(pickupDate)
                    const date2 = new Date(dropupDate)
                    const differenceInMilliseconds = Math.abs(Date1 - date2);
                    const differenceInDays = Math.floor(differenceInMilliseconds / (24 * 60 * 60 * 1000));
                    const totalPtice = carRating * differenceInDays;
                    console.log("day diff==>", totalPtice);
                    const carBookingDetails = {
                        from: from,
                        pickupDate: pickupDate,
                        DropDate: dropupDate,
                        carName: myCarDetails.carName,
                        price: carRating,
                        totalPrice: totalPtice,
                        vehicalNo: myCarDetails.vehicalNo,
                        bookId: myCarKey,
                        pickupTime: pickupTime,
                        dropTime: dropupTime
                    }
                    console.log("object data =>", carBookingDetails);
                    if (carBookingDetails) {

                        const carBookingStr = JSON.stringify(carBookingDetails)
                        localStorage.setItem("booking", carBookingStr);

                        const token = Cookies.get("LTK");
                        if (token) {

                            window.location.href = DOMAIN + "booking-confiem";
                        } else {
                            window.location.href = DOMAIN + "login";
                        }
                    }

                }
            }

        } catch (error) {
            console.log("car booking error", error)
        }
    }

    useEffect(() => {
        handlerDisplayOneCarDetails()
    }, [])

    const [hour, setHour] = useState(12);

    const options = [];
    for (let i = 1; i <= hour; i++) {
        options.push(
            <option key={i} value={i}>
                {i}
            </option>
        )
    }


    return (
        <>
            <div className="d-flex blackgroun">

                <div className='car-del-main'>

                    {myCarDetails && myCarDetails.image && myCarDetails.city ? (
                        <div className='carframe'>
                            <div className='image-frame' style={{ marginTop: "5rem" }}>
                                <div className='mx-2'>
                                    <img src={currentImage || BASE_URL + /carImage/ + myCarDetails.image[0]} alt="" className='image-display' />
                                </div>
                                <div className='car-imag-mul mx-1' id="mul-car">
                                    <img src={BASE_URL + /carImage/ + myCarDetails.image[1]} alt="" className='image-side mx-1 my-1' onClick={(e) => sliderGallery(BASE_URL + /carImage/ + myCarDetails.image[1])} />
                                    <img src={BASE_URL + /carImage/ + myCarDetails.image[0]} alt="" className='image-side mx-1 my-1' onClick={(e) => sliderGallery(BASE_URL + /carImage/ + myCarDetails.image[0])} />
                                    <img src={BASE_URL + /carImage/ + myCarDetails.image[2]} alt="" className='image-side  mx-1 my-1' onClick={(e) => sliderGallery(BASE_URL + /carImage/ + myCarDetails.image[2])} />
                                    <img src={BASE_URL + /carImage/ + myCarDetails.image[3]} alt="" className='image-side mx-1 my-1' onClick={(e) => sliderGallery(BASE_URL + /carImage/ + myCarDetails.image[3])} />
                                    <img src={BASE_URL + /carImage/ + myCarDetails.image[4]} alt="" className='image-side mx-1 my-1' onClick={(e) => sliderGallery(BASE_URL + /carImage/ + myCarDetails.image[4])} />
                                    {/* <img src={BASE_URL + /carImage/ + myCarDetails.image[5]} alt="" className='image-side mx-1 my-1' /> */}
                                </div>
                            </div>



                            <div className='car-del'>

                                <div className='bn-CarDetaileBody'>
                                    <p> {myCarDetails.carName}</p>
                                    <h4 className='bn-specification'>Specifications</h4>
                                    <div className='car-data'>
                                        <span className='item1'>Seat</span>
                                        <span className='vehicle-item' style={{ marginLeft: "7rem" }}>{myCarDetails.seats}</span>
                                    </div>
                                    <div className='car-data'>
                                        <span className='item1'>Vehicle</span>
                                        <span className='vehicle-item ' style={{ marginLeft: "5rem" }}>{myCarDetails.vehicalNo}</span>
                                    </div>
                                    <div className='car-data'>
                                        <span className='item1'>Make year</span>
                                        <span className='vehicle-item' style={{ marginLeft: "4rem" }}>{makeDate}</span>
                                    </div>
                                    <div className='car-data'>
                                        <span className='item1'>Registration year</span>
                                        <span className='vehicle-item'>{formatDate}</span>
                                    </div>
                                    <div className='car-data'>
                                        <span className='item1'>Trasmission</span>
                                        <span className='vehicle-item' style={{ marginLeft: "3.6rem" }}>{myCarDetails.trasmission}</span>
                                    </div>
                                    <div className='car-data'>
                                        <span className='item1'>City</span>
                                        <span className='vehicle-item' style={{ marginLeft: "7rem" }}>{myCarDetails.city}</span>
                                    </div>
                                    <div className='car-data'>
                                        <span className='item1'>Posted By</span>
                                        <span className='vehicle-item' style={{ marginLeft: "4rem" }}>{myCarDetails.admidName}</span>
                                    </div>

                                </div>
                            </div>



                            <div className='booking-side mx-2' >
                                <h4 className='book-title'>Book This car</h4>
                                <div className='amount-screen'>
                                    <p>Per Day</p>
                                    <h2 ref={pRef}>{carRating.substring(carRating.length - 5)}₹</h2>
                                </div>

                                <div>
                                    <span className="" >Pickup Location</span>
                                    <input
                                        type="text"
                                        className="my-input"
                                        placeholder='Your pickup location'
                                        onChange={inputFrom}
                                    />
                                    <div style={{ height: "0.8rem", color: "red", fontSize: "small" }}>
                                        {errorFrom}

                                    </div>
                                    <div>

                                        <span className="" >Pick Up Date & Time</span>
                                        <div style={{ display: "flex" }}>

                                            <input
                                                type="date"
                                                style={{ width: "12rem" }}
                                                className="my-input"
                                                placeholder='Your pickup location'
                                                onChange={inputPickupDate}
                                                // value={todays}
                                                min={todays}
                                            />
                                            <input type="Time"
                                                className="timeInput"
                                                onChange={(e) => setPickupTime(e.target.value)}
                                            />
                                        </div>
                                        <div style={{ height: "0.3rem", color: "red", fontSize: "small" }}>
                                            {errorPickup}
                                        </div>
                                    </div>
                                    <div style={{ marginTop: "1rem" }}>

                                        <span className="drop-time"  >Drop Up Date & Time</span>
                                        <div style={{ display: "flex" }}>
                                            <input
                                                type="date"
                                                style={{ width: "12rem" }}
                                                className="my-input"
                                                placeholder='Your pickup location'
                                                onChange={inputDropupDate}
                                                // value={todays}
                                                min={todays}
                                            />
                                            <input type="Time"
                                                className="timeInput"
                                                onChange={(e) => setDropupTime(e.target.value)}
                                            />
                                        </div>
                                        <div style={{ height: "0.3rem", color: "red", fontSize: "small" }}>
                                            {errorDropDate}
                                        </div>
                                    </div>
                                    <CustomButton onClick={handlarCarBooking} className="btn-book"> Continue</CustomButton>


                                </div>
                                {/* <div>
                                   
                                    <div className='input-side'>

                                        <span className="input-lable" >FROM</span>
                                        <input
                                            type="text"
                                            className="my-input col-8"
                                            placeholder='Your pickup location'
                                            onChange={inputFrom}
                                        />
                                    </div>
                                    <div style={{ height: "0.8rem", color: "red", marginLeft: "9rem" }}>
                                        {errorFrom}

                                    </div>
                                    <div className='input-side-date'>

                                        <span className="input-lable" >DATE/TIME</span>
                                        <input
                                            type="date"
                                            style={{ width: "8rem" }}
                                            className="my-input"
                                            placeholder='Your pickup location'
                                            onChange={inputData}
                                            // value={todays}
                                            min={todays}
                                        />

                                        <div class="cs-form">

                                            <input
                                                type="time"
                                                class="form-control"
                                                value={times}
                                                onChange={inputtime}
                                                style={{ width: "8rem" }}
                                            />
                                        </div>

                                    </div>

                                    <div style={{ height: "0.3rem", color: "red", marginLeft: "9rem" }}>
                                        {errorDate}
                                    </div>
                                    <div className='my-pack' id='myDropdown' >
                                        <span className="input-lable-pack" >PACKAGES</span>
                                        <select name="" id="dropdown" className='dropdown1' onChange={inputPackage} >
                                            <option value="">Select Packages</option>
                                            <option value="1 hrs 10 km">1 hrs 10 km </option>
                                            <option value="2 hrs 20 km">2 hrs 30 km</option>
                                            <option value="3 hrs 40 km">3 hrs 40 km</option>
                                            <option value="5 hrs 60 km">5 hrs 60 km</option>
                                            <option value="7 hrs 80 km">7 hrs 80 km</option>
                                            <option value="9 hrs 100 km">9 hrs 100 km</option>
                                            <option value="10 hrs 110 km">10 hrs 110 km</option>
                                        </select>
                                    </div>
                                    <div style={{ height: "0rem", color: "red", marginLeft: "9rem", marginTop: "-1rem" }}>
                                        {errorPackage}
                                    </div>

                                    <div className='btn-booking'>
                                        <CustomButton onClick={handlarCarBooking}> Continue</CustomButton>
                                    </div>


                                </div> */}
                            </div>
                            {/* </div> */}

                        </div>
                    )
                        : (

                            <PageLoader />



                        )
                    }




                </div>

            </div>
            {/* <Footer /> */}
        </>
    )
}

export default CarDetails; 