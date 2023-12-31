import React,{useState,useEffect} from "react";
import AdminNav from "../../../components/nav/AdminNav";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import { createCategory,getCategories,removeCategory } from "../../../functions/category";
import { Link } from "react-router-dom";
import { EditOutlined,DeleteOutlined } from "@ant-design/icons";
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";

const CategoryCreate = () =>{

  //without onChange we  cannot change the property value,whatever the name variable is assgined intitally it will be fixed in value 
    const {user} =useSelector((state)=>({...state}));//destructuring the state object by spreading it and getting user out of that
    const [name,setName]=useState("");
    const [loading,setLoading]=useState(false);
    const [categories,setCategories]=useState([]);
    const [keyword,setKeyword] = useState("");

    //we use useEffect to show all the categories (list all categories) when the component mounts
    useEffect(()=>{
          loadCategories();
    },[]);
      
    const loadCategories = ()=>(getCategories().then((c)=>setCategories(c.data)));
     //while admin creates category and presses submit,while it submits we show loading 

   const handleSubmit = (e)=>{
    e.preventDefault();
    //console.log(name);
    setLoading(true);
    createCategory({name},user.token)
    .then(res => {
      console.log(res);
      setLoading(false);
      setName("");
      toast.success(`"${res.data.name}" is created`);
      loadCategories();
    })
    .catch(err =>{
      console.log(err);
      setLoading(false);
      //we are sending the error messag from backend as status code in controllers/category.js 
      if(err.response.status === 400)toast.error(err.response.data);
    });
   };

   const handleRemove = async (slug)=>{
        if(window.confirm("Are you sure you want to delete")){
          setLoading(true);
          removeCategory(slug,user.token)
          .then(res=>{
            setLoading(false);
            toast.error(`${res.data.name} deleted`);
            loadCategories();
          })
          .catch(err=>{
            setLoading(false);
            if(err.response.status === 400){
              toast.error(err.response.data);
              setLoading(false);
            };
          })
        }
   }

  
const searched = (keyword) => (c)=> c.name.toLowerCase().includes(keyword) ;//we get c from categories array


    return( <div className="contianer-fluid"> 
    <div className="row">
    <div className="col-md-2">
    <AdminNav/>
    </div>
    <div className="col">
    {loading ?<h4 className="text-danger">Loading...</h4>:<h4>Create Category</h4>}    
    <CategoryForm handleSubmit={handleSubmit} name={name} setName={setName}/>
    <br />
    <LocalSearch 
    keyword={keyword}
    setKeyword={setKeyword}
    />
    {categories.filter(searched(keyword)).map((c)=>(
         <div key={c._id} className="alert alert-secondary">
         {c.name} 
         <span onClick={()=>handleRemove(c.slug)} className="float-end btn btn-sm">
         <DeleteOutlined className="text-danger"/>
         </span> 
         <Link to={`/admin/category/${c.slug}`}>
         <span className="float-end btn btn-sm"><EditOutlined className="text-warning"/></span>
         </Link>
         </div>
    ))}
    </div>
    </div>
    </div>);

};

export default CategoryCreate;