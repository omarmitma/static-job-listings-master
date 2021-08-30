
/* Variabloes Goblales*/
let wrapSearch=document.getElementById('wrapSearch');
let wrapJobs=document.getElementById('wrapJobs');
let newText='';
let featuredText='';
let languages='';
let toolsInner='';
let featuredClass='';
/* Agregamos los datos */
function traerDatos(){
    const xhttp=new XMLHttpRequest();
    xhttp.open('GET','data.json',true);
    xhttp.send();
    xhttp.onreadystatechange=function(){
        if(this.readyState==4 && this.status==200){
            let datos=JSON.parse(this.responseText);
            for(let item of datos){
                for(let l of item.languages)languages +=`<button onclick="addSearch('${l}')">${l}</button>`;
    
                for(let tool of item.tools)toolsInner+=`<button onclick="addSearch('${tool}')">${tool}</button>`;
                create(item.company,item.logo,item.new,item.featured,item.position,item.postedAt,item.contract,item.location,item.role,item.level,languages,toolsInner);
                languages='';
                toolsInner='';
            }
        }
    };
}
/* Crear los divs para los jobs */
function create(company,logo,nuevo,featured,position,postedAt,contract,location,role,level,languages,toolsInner){
    if(nuevo) newText=`<span class="new">New</span>`;
    else newText='';
    
    if(featured) {
        featuredText=`<span class="featured">Featured</span>`;
        featuredClass='jobFeatured'
    }
    else {
        featuredText='';
        featuredClass='';
    }
    wrapJobs.innerHTML+=`<div class="job ${featuredClass}"> 
                            <div class="wrapText">
                                <div class="img">
                                    <img src=${logo} alt="logo ${company}">
                                </div>
                                <div class="text">
                                    <div class="wrapCompany">
                                        <span class="company">
                                        ${company}
                                        </span>
                                        ${newText}
                                        ${featuredText}
                                    </div>
                                    <div class="position">
                                        <a href="#">${position}</a>
                                    </div>
                                    <div class="details">
                                        <span>${postedAt}</span>
                                        <span>${contract}</span>
                                        <span>${location}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="features">
                                <div class="buttons">
                                    <button onclick="addSearch('${role}')">${role}</button>
                                    <button onclick="addSearch('${level}')">${level}</button>
                                    ${languages}
                                    ${toolsInner}
                                </div>
                            </div>
                        </div>`;
    
}

let prevSearch='';
let sear=document.getElementById('search');
let clear=document.getElementById('clear');

function addSearch(search){
    let cadena=prevSearch.indexOf(search);
    if(cadena !== -1){
        console.log('Ya esta en la busqueda')
    }else{
        wrapSearch.classList.add('wrapSearch');
        clear.innerHTML='<button onclick="clearSearch()">Clear</button>';
        sear.insertAdjacentHTML('beforeend',`<div class="itemSearch" id="item${search}">
                                                <div class="text">
                                                    <span class="searchSpan">${search}</span>
                                                </div>
                                                <div class="btnCancel" onclick="deleteSearch('${search}')">
                                                    <img src="images/icon-remove.svg" alt="icon remove">
                                                </div>
                                            </div>`)
        prevSearch+=search;
    }
    searchJobs(search)
}
/* Buscar los trabajos */
function searchJobs(s){
    let searchTotal=[];
    const x=new XMLHttpRequest();
    x.open('GET','data.json',true);
    x.send();
    capas=document.querySelectorAll('.searchSpan');
    wrapJobs.innerHTML='';
    for (i=0;i<capas.length;i++){
        searchTotal.push(capas[i].innerHTML);
    }
    x.onreadystatechange=function(){
        if(this.readyState==4 && this.status==200){
            let datos=JSON.parse(this.responseText);
            for(let item of datos){
                /* Convertimos los arrays en string */
                let roleString=item.role.toString();
                let level=item.level.toString();
                let lengString=item.languages.toString();
                let toolsString=item.tools.toString();
                
                let searchString=lengString+","+toolsString+","+roleString+","+level;
                let paint=false;
                for(let tf of searchTotal){
                    if(searchString.indexOf(tf)!==-1){
                        paint=true;
                    }else{
                        paint=false;
                        break;
                    }
                }
                if(paint){
                    for(let l of item.languages)languages +=`<button onclick="addSearch('${l}')">${l}</button>`;
                    for(let tool of item.tools)toolsInner+=`<button onclick="addSearch('${tool}')">${tool}</button>`;
                    create(item.company,item.logo,item.new,item.featured,item.position,item.postedAt,item.contract,item.location,item.role,item.level,languages,toolsInner);
                    languages='';
                    toolsInner='';
                }else{
                        
                }
                
            }
        }
    }
}
/* Button remove */
function deleteSearch(search){
    let itemRemove=document.getElementById(`item${search}`)
    prevSearch=prevSearch.replace(search,"");
    itemRemove.remove();
    if(prevSearch===""){
        clearSearch()
    }
    searchJobs(search);
}

/* button clear */
function clearSearch(){
    wrapJobs.innerHTML='';
    document.getElementById('search').innerHTML='';
    wrapSearch.classList.remove('wrapSearch');
    clear.innerHTML='';
    prevSearch="";
    traerDatos();
}

traerDatos();