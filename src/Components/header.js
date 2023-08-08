import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import InfoIcon from "@mui/icons-material/Info";
import MenuIcon from "@mui/icons-material/Menu";

export default function Header() {
  const [name, setName] = useState("");
  const [login, setLogin] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [exploreAnchorEl, setExploreAnchorEl] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("username")) {
        setName(localStorage.getItem("username"));
        setLogin(true);
      } else {
        setName("");
        setLogin(false);
      }
    }
    if(localStorage.getItem("uploadedImage"))
    {
      setUploadedImage(localStorage.getItem("uploadedImage"));
    }
    else setUploadedImage(null);
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function stringToColor(string) {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }


  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    setName("");
    setLogin(false);
    setAnchorEl(null);
  };
  const handleImageUpload = async (event) => {
    try {
      const file = event.target.files[0];

      if (!file) {
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/upload`, formData, {
      });
      localStorage.setItem("uploadedImage",response.data.secure_url);
      setUploadedImage(response.data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
   
  };
  function stringAvatar(name, withUpload = false) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: withUpload ? (
        <>
          {uploadedImage ? (
            <Avatar
              src={uploadedImage}
              alt="Avatar"
              sx={{ width: 76, height: 76 }}
              onClick={handleImageUpload}
            />
          ) : (
            <Avatar sx={{ width: 76, height: 76 }}>{name.split(" ")[0][0]}</Avatar>
          )}
        </>
      ) : (
        `${name.split(" ")[0][0]}`
      ),
    };
  }
  
  const handleMenuOpen = (event) => {
    setExploreAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setExploreAnchorEl(null);
  };

  return (
    <>
      <div className="header">
        <div className="logoheader">
          <img className="logo" src="/logo.png" alt="Logo" />
          <h1>puzzleLAND</h1>
        </div>
        <div className="btnclass">
          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="mobile-menu"
                anchorEl={exploreAnchorEl}
                open={Boolean(exploreAnchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  style: {
                    backgroundColor: "black",
                  },
                }}
              >
                <MenuItem>
                  <Link href="/" passHref>
                    <div>
                      <HomeIcon sx={{color:"aqua"}}/>
                    </div>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link href="/about" passHref>
                    <div>
                      <InfoIcon sx={{color:"aqua"}}/>
                    </div>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link href="/contact"  passHref>
                    <div>
                      <ContactMailIcon sx={{color:"aqua"}} />
                    </div>
                  </Link>
                </MenuItem>
                <MenuItem>
                <div className="loginbtn">
            {login ? (
              <>
                <Avatar {...stringAvatar(name,true)} src={uploadedImage}onClick={handlePopoverOpen} />
                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handlePopoverClose}
                >
                  <MenuItem>
                    <div className="popover1">
                      <p>{name}</p>
                    </div>
                  </MenuItem>
                  <MenuItem>
                    <div className="popover1">
                      {uploadedImage && (
                        <Avatar 
                          src={uploadedImage}
                          alt="Avatar"
                          sx={{ width: 76, height: 76 }}
                          onClick={handleImageUpload}
                        />
                      )}
                      {!uploadedImage && (
                        <Avatar sx={{ width: 76, height: 76 }} />
                      )}
                    </div>
                  </MenuItem>
                  <MenuItem>
                    <div className="popover1">
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </MenuItem>
                  <MenuItem>
                    <div className="popover1">
                      <Button variant="outlined" onClick={handleLogout}>
                        Logout
                      </Button>
                    </div>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Link href="/login" passHref>
                <Avatar />
              </Link>
            )}
          </div>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <div className="headerbtn">
              <div className="materialheader">
                <Tooltip title="Home" arrow>
                  <Link href="/" passHref>
                    <div>
                      <HomeIcon sx={{color:"aqua",width:"2rem",height:"2rem"} } />
                    </div>
                  </Link>
                </Tooltip>
              </div>

              <div className="materialheader">
                <Tooltip title="About Us" arrow>
                  <Link href="/about" passHref>
                    <div>
                      <InfoIcon sx={{color:"aqua",width:"2rem",height:"2rem"} }/>
                    </div>
                  </Link>
                </Tooltip>
              </div>
              <div className="materialheader">
                <Tooltip title="Contact Us" arrow>
                  <Link href="/contact" passHref>
                    <div>
                      <ContactMailIcon sx={{color:"aqua",width:"2rem",height:"2rem"} } />
                    </div>
                  </Link>
                </Tooltip>
              </div>
              <div className="loginbtn">
            {login ? (
              <>
                <Avatar {...stringAvatar(name)} src={uploadedImage} onClick={handlePopoverOpen} />
                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handlePopoverClose}
                >
                  <MenuItem>
                    <div className="popover1">
                      <p>{name}</p>
                    </div>
                  </MenuItem>
                  <MenuItem>
                    <div className="popover1">
                      {uploadedImage && (
                        <Avatar
                          src={uploadedImage}
                          alt="Avatar"
                          sx={{ width: 76, height: 76 }}
                          onClick={handleImageUpload}
                        />
                      )}
                      {!uploadedImage && (
                        <Avatar sx={{ width: 76, height: 76 }} />
                      )}
                    </div>
                  </MenuItem>
                  <MenuItem>
                    <div className="popover1">
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </MenuItem>
                  <MenuItem>
                    <div className="popover1">
                      <Button variant="outlined" onClick={handleLogout}>
                        Logout
                      </Button>
                    </div>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Link href="/login" passHref>
                <Avatar />
              </Link>
            )}
          </div>
            </div>
          )}
         
        </div>
      </div>
    </>
  );
}
