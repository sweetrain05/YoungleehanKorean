// 👻 Developed by DanBi Choi on Aug 16th, 2023.
// -----------------------------------------------------
import Jumbotron from "../../components/cards/Jumbotron";
import UserMenu from "../../components/nav/UserMenu";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/User/UserProfile.scss";
import useWindowWidth from "./../../hooks/useWindowWidth";
import ProfileInput from "../../components/cards/ProfileInput";
import ProfileDropDownInput from "../../components/cards/ProfileDropDownInput";

import ModalInfo from "../../components/common/ModalInfo";

export default function UserProfile() {
    // states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [country, setCountry] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipcode, setZipcode] = useState("");

    // hooks
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const windowWidth = useWindowWidth();

    // redirect anonymous user
    useEffect(() => {
        if (!auth?.token) {
            navigate("/login");
        } else {
            loadUserProfile();
        }
    }, []);

    const loadUserProfile = async () => {
        try {
            const { data } = await axios.get(`/userInfo`);
            if (data?.error) {
                console.log(data.error);
            } else {
                console.log(data);
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setEmail(data.email);
                setCountry(data.country);
                setAddress1(data.address1);
                setAddress2(data.address2);
                setCity(data.city);
                setState(data.state);
                setZipcode(data.zipcode);
            }
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong. Please try again.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || password.length < 6) {
            setIsModalOpen(true);
        } else {
            try {
                const { data } = await axios.put("/profileUpdate", {
                    firstName,
                    lastName,
                    password,
                    country,
                    address1,
                    address2,
                    city,
                    state,
                    zipcode,
                });

                if (data?.error) {
                    toast.error(data.error);
                } else {
                    setAuth({ ...auth, user: data });
                    // local storage update
                    let ls = localStorage.getItem("auth");
                    ls = JSON.parse(ls);
                    ls.user = data;
                    localStorage.setItem("auth", JSON.stringify(ls));
                    setPassword("");
                    toast.success("Profile updated successfully!");
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    // Modal Handlers
    const handleOk = () => setIsModalOpen(false);
    const handleCancel = () => setIsModalOpen(false);

    const handleInput = (label, value) => {
        switch (label) {
            case "First Name":
                return setFirstName(value);
            case "Last Name":
                return setLastName(value);
            case "Password":
                return setPassword(value);
            case "Country":
                return setCountry(value);
            case "Address 1":
                return setAddress1(value);
            case "Address 2":
                return setAddress2(value);
            case "City":
                return setCity(value);
            case "State":
                return setState(value);
            case "Zip code":
                return setZipcode(value);
            default:
                return;
        }
    };

    return (
        <>
            <Jumbotron
                title={`Hello, ${auth?.user?.firstName}!`}
                directory={"Dashboard"}
                subDirectory={"Profile"}
            />
            <div
                style={{ maxWidth: "1170px", minHeight: "300px" }}
                className="container-fluid"
            >
                <div className="row" style={{ margin: "75px 0" }}>
                    <div className="col-md-3">
                        <UserMenu id={1} />
                    </div>
                    <div className="col-md-9">
                        <div
                            className="profile-box"
                            style={{
                                padding: "35px",
                                backgroundColor: "#FFF",
                                borderRadius: "10px",
                                boxShadow:
                                    "0px 5px 30px 0px rgba(219, 219, 219, 0.30)",
                            }}
                        >
                            <h1
                                style={{
                                    fontSize: "20px",
                                    fontWeight: "600",
                                    marginBottom: "23px",
                                }}
                            >
                                My Profile
                            </h1>
                            <ul className="profileForm d-flex flex-column justify-content-between">
                                <li className="single">
                                    <ProfileInput
                                        label={"Email"}
                                        type={"email"}
                                        value={email}
                                        disabled={true}
                                    />
                                </li>
                                <li
                                    className={
                                        windowWidth > 767 ? "double" : "single"
                                    }
                                >
                                    <ProfileInput
                                        label={"First Name"}
                                        type={"text"}
                                        value={firstName}
                                        placeholder={"Your first name"}
                                        handleInput={handleInput}
                                    />

                                    <ProfileInput
                                        label={"Last Name"}
                                        type={"text"}
                                        value={lastName}
                                        placeholder={"Your last name"}
                                        handleInput={handleInput}
                                    />
                                </li>
                                <li className="single">
                                    <ProfileInput
                                        label={"Password"}
                                        type={"password"}
                                        value={password}
                                        placeholder={"Current password"}
                                        handleInput={handleInput}
                                    />
                                </li>
                                <li className="single">
                                    <ProfileDropDownInput
                                        label={"Country"}
                                        value={country}
                                        placeholder={"Select your country"}
                                        handleInput={handleInput}
                                        data={countryList}
                                    />
                                </li>
                                {country === "United States" && (
                                    <>
                                        <li
                                            className={
                                                windowWidth > 767
                                                    ? "double"
                                                    : "single"
                                            }
                                        >
                                            <ProfileInput
                                                label={"Address 1"}
                                                type={"text"}
                                                value={address1}
                                                placeholder={"Your address"}
                                                handleInput={handleInput}
                                            />
                                            <ProfileInput
                                                label={"Address 2"}
                                                type={"text"}
                                                value={address2}
                                                placeholder={"(Optional)"}
                                                handleInput={handleInput}
                                            />
                                        </li>
                                        <li
                                            className={
                                                windowWidth > 767
                                                    ? "double"
                                                    : "single"
                                            }
                                        >
                                            <ProfileInput
                                                label={"City"}
                                                type={"text"}
                                                value={city}
                                                placeholder={"City"}
                                                handleInput={handleInput}
                                            />
                                            <ProfileDropDownInput
                                                label={"State"}
                                                value={state}
                                                placeholder={"State"}
                                                handleInput={handleInput}
                                                data={usStatesList}
                                            />
                                        </li>
                                        <li
                                            className={
                                                windowWidth > 767
                                                    ? "double"
                                                    : "single"
                                            }
                                        >
                                            <ProfileInput
                                                label={"Zip code"}
                                                type={"text"}
                                                value={zipcode}
                                                placeholder={"Zip code"}
                                                handleInput={handleInput}
                                                maxlength={5}
                                            />
                                        </li>
                                    </>
                                )}
                                <button
                                    className="btn btn-primary"
                                    style={{
                                        margin: "10px 0",
                                        borderRadius: "10px",
                                    }}
                                    onClick={handleSubmit}
                                >
                                    Update Profile
                                </button>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <ModalInfo
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
                okBtnText={"Ok"}
                text={
                    "Password is required and should be min 6 characters long."
                }
            />
        </>
    );
}

const countryList = [
    "United States",
    "Afghanistan",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "British Indian Ocean Territory",
    "British Virgin Islands",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cape Verde",
    "Caribbean Netherlands",
    "Cayman Islands",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Christmas Island",
    "Cocos (Keeling) Islands",
    "Colombia",
    "Comoros",
    "Cook Islands",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Curaçao",
    "Cyprus",
    "Czechia",
    "DR Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Falkland Islands",
    "Faroe Islands",
    "Fiji",
    "Finland",
    "France",
    "French Guiana",
    "French Polynesia",
    "French Southern and Antarctic Lands",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Heard Island and McDonald Islands",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Ivory Coast",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kosovo",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macau",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Niue",
    "Norfolk Island",
    "North Korea",
    "North Macedonia",
    "Northern Mariana Islands",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Pitcairn Islands",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Réunion",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Barthélemy",
    "Saint Helena",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Martin",
    "Saint Pierre and Miquelon",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "São Tomé and Príncipe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Sint Maarten",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Georgia",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Svalbard and Jan Mayen",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States Minor Outlying Islands",
    "Uruguay",
    "U.S. Virgin Islands",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Wallis and Futuna",
    "Western Sahara",
    "Yemen",
    "Zambia",
    "Zimbabwe",
];

const usStatesList = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
];
