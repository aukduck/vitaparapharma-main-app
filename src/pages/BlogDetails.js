import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import { IoMdShare } from "react-icons/io";
import NavHeader from "../components/NavHeader";
import { useSelector, useDispatch } from "react-redux";
import {
  setLanguage,
  selectLanguage,
  selectTranslations,
} from "../rtk/slices/Translate-slice";
import { useRef } from "react";
import email from "../images/Email icon.png";
import address from "../images/Location icon.png";
import phone from "../images/phone icon.png";
import { Link } from "react-router-dom";
import lotion2 from "../images/lotion2.png";
import { AiOutlineLike } from "react-icons/ai";
import { selectToken } from "../rtk/slices/Auth-slice";
import { AiOutlineDislike } from "react-icons/ai";
import { Modal, Button } from "react-bootstrap";
import WhatsAppIcon from "../components/Whatsapp";
import Footer from "../components/Footer";
import { baseUrl } from "../rtk/slices/Product-slice";

function BlogDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const [blog, setBlog] = useState([]);
  /*const handleFileChange = (e) => {
    const file = e.target.files[0];
    setBlog({ ...blog, Poster: file });
  };*/
  const [isCopied, setIsCopied] = useState(false);
  const pageLinkRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const allProducts = useSelector((state) => state.products);
  const language = useSelector(selectLanguage);
  const translations = useSelector(selectTranslations);
  const [searchTerm, setSearchTerm] = useState("");
  const bearerToken = useSelector(selectToken);
  const { blogId } = useParams();
  const [blogDetails, setblogDetails] = useState(null);
  const isUserLoggedIn = useSelector(selectToken) !== null;

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await fetch(`${baseUrl}/public/post/${blogId}`, {
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": language,
          },
        });
        const data = await response.json();
        setblogDetails(data.data.post);
        console.log("data is", data);
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    };

    fetchBlogDetails();
  }, [blogId]);




  const handleCopyLink = async () => {
    const blogTitle = blogDetails?.title; // Get the blog title
    const blogImageURL = blogDetails?.pictureUrl; // Get the URL of the blog image
    const pageURL = window.location.href; // Get the current page URL
    
    try {
      // If the blog image URL is available, try copying the image itself
      if (blogImageURL) {
        const blob = await fetch(blogImageURL).then((response) => response.blob());
        
        // Convert the image blob into a data URL
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const imageDataURL = reader.result;
          
          // Include the image data URL and title in the clipboard data
          const items = [
            new ClipboardItem({
              'text/plain': new Blob([`${imageDataURL}\n${blogTitle}\n${pageURL}`], { type: 'text/plain' }), // Add title, image, and URL
            })
          ];
          
          // Write the clipboard data
          navigator.clipboard.write(items).then(() => {
            setIsCopied(true);
            setTimeout(() => {
              setIsCopied(false);
            }, 1000);
          }).catch((error) => {
            console.error('Error copying:', error);
          });
        };
      } else {
        // Copy only the text content if no image is available
        await navigator.clipboard.writeText(`${blogTitle}: ${pageURL}`);
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };


  
  

  
  
  

  const handleProductClick = (productId) => {
    navigate(`/home/product/${productId}`);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term.toLowerCase());
  };

  const [like, setLike] = useState([]);

  const isProductInWishlist = (blogPostId) => {
    return blogDetails && like.some((item) => item.blogPostId === blogPostId);
  };

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleCloseModal = () => setShowModal(false);

  const handleAddToLikes = async (blogPostId) => {
    try {
      if (!isUserLoggedIn) {
        setModalMessage("please sign in first");
        setShowModal(true);
        return;
      }
      let updatedLike;

      if (isProductInWishlist(blogPostId)) {
        await handleDeleteFromLike(blogPostId);
        updatedLike = like.filter((item) => item.blogPostId !== blogPostId);
      } else {
        await axios.put(
          `${baseUrl}/user/like/${blogPostId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Accept-Language": language,
            },
          }
        );
        updatedLike = [...like, { blogPostId }];
        console.log("added like successfully");
      }
      setLike(updatedLike);
    } catch (error) {
      console.error("Error updating product in wishlist: ", error.message);
    }
  };

  const handleDeleteFromLike = async (blogPostId) => {
    try {
      if (!isUserLoggedIn) {
        setModalMessage("please sign in first");
        setShowModal(true);
        return;
      }
      await axios.delete(`${baseUrl}/user/unlike/${blogPostId}`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Accept-Language": language,
        },
      });
      console.log("deleted succefully");
    } catch (error) {
      console.error("Error deleting product from wishlist:", error);
    }
  };

  const [isDisliked, setIsDisliked] = useState(false);

  const handleDislike = async (postId) => {
    try {
      if (!isUserLoggedIn) {
        setModalMessage("please sign in first");
        setShowModal(true);
        return;
      }

      await axios.put(
        `${baseUrl}/user/dislike/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Accept-Language": language,
          },
        }
      );
      console.log("Post disliked successfully");
      setIsDisliked(!isDisliked);
    } catch (error) {
      console.error("Error disliking post:", error.message);
    }
  };

  return (
    <div className="">
      <NavHeader
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        handleProductClick={handleProductClick}
      />

      <div className="bg-gray-50 bottom-0 overflow-y-hidden mt-[150px] ">
        <div className="">
          <WhatsAppIcon />
          <div className="md:mr-24 mx-4 overflow-y-hidden min-h-screen">
            <div>
              <div className="">
                <div className="flex flex-col md:flex-row">
                  <div className="w-[100%] md:w-[40%] bg-transparent md:ml-20   mt-12">
                    <img
                      className="w-full h-[100%] md:w-[90%]  rounded-tr-3xl rounded-bl-3xl"
                      src={blogDetails && blogDetails.pictureUrl}
                      alt="Product poster"
                    />
                  </div>

                  <div className="w-[100%] md:w-[60%] mt-[3em]">
                    <div className="flex flex-row">
                      <div className="flex flex-row items-center justify-start mb-5 bg-[#61DAA2] w-36 rounded-lg py-2">
                        <div className="">
                          <AiOutlineLike
                            style={{
                              fontSize: "35px",
                              cursor: "pointer",
                              color: isProductInWishlist(
                                blogDetails?.blogPostId
                              )
                                ? "blue"
                                : "white",
                            }}
                            className="ml-[10px]"
                            onClick={() =>
                              handleAddToLikes(blogDetails?.blogPostId)
                            }
                          />
                        </div>

                        <div className="">
                          <AiOutlineDislike
                            style={{
                              fontSize: "35px",
                              cursor: "pointer",
                              color: isDisliked ? "blue" : "white",
                            }}
                            className="ml-[10px]"
                            onClick={() =>
                              handleDislike(blogDetails?.blogPostId)
                            }
                          />
                        </div>

                        <div className="">
                          <IoMdShare
                            style={{
                              fontSize: "35px",
                              cursor: "pointer",
                              color: "white",
                            }}
                            className="ml-[10px]"
                            onClick={handleCopyLink}
                          />
                        </div>
                      </div>
                      <div>
                        {isCopied && (
                          <span style={{ marginLeft: "5px", color: "#3A7E89" }}>
                            Link copied!
                          </span>
                        )}
                        <input
                          ref={pageLinkRef}
                          type="text"
                          readOnly
                          value={window.location.href}
                          style={{ position: "absolute", left: "-9999px" }}
                        />
                      </div>
                    </div>

                    {blogDetails ? (
                      <div>
                        <h5>{blogDetails.title}</h5>
                      </div>
                    ) : (
                      <p>Loading...</p>
                    )}
                    {blogDetails ? (
                      <div>
                        <h6>{blogDetails.content}</h6>
                      </div>
                    ) : (
                      <p>Loading...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BlogDetails;
