import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userActions } from "../store/user-slice";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    
    dispatch(userActions.logout());

    navigate("/login", { replace: true });
  }, [dispatch, navigate]);

  return null;
};

export default Logout;
