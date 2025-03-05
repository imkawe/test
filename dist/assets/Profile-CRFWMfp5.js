import{a as D,u as L,r as c,b as r,j as e,L as A,F as M,d as k,e as z,f as I,g as P,h as T,c as b,y as o}from"./index-CT1dYHP2.js";import{A as U}from"./AddressForm-DeI5Dsgs.js";const S=s=>{var m,u;return s?{id:s.id||null,addressLine:(s.addressLine||"").trim(),city:(s.city||"").trim(),state:(s.state||"").trim(),pincode:((m=s.pincode)==null?void 0:m.toString())||"",country:(s.country||"").trim(),mobile:((u=s.mobile)==null?void 0:u.toString())||"",userId:s.userId||null}:{}},H=()=>{const{user:s}=D();L();const[m,u]=c.useState(!0),[f,h]=c.useState([]),[l,N]=c.useState(null),[p,a]=c.useState(null),[y,v]=c.useState(null),g=()=>({headers:{Authorization:`Bearer ${sessionStorage.getItem("authToken")}`}});c.useEffect(()=>{s&&(async()=>{try{const{data:i}=await b.get("https://cloudflare-d1.ujhuji.workers.dev/api/addresses",g());h(i.data.map(S))}catch{o.error("Error cargando direcciones")}finally{u(!1)}})()},[s]);const C=async()=>{var t,i;try{await b.delete(`https://cloudflare-d1.ujhuji.workers.dev/api/addresses/${y}`,g()),h(n=>n.filter(d=>d.id!==y)),o.success("Dirección eliminada correctamente")}catch(n){o.error(((i=(t=n.response)==null?void 0:t.data)==null?void 0:i.error)||"Error eliminando dirección")}finally{v(null),a(null)}},E=async t=>{var i,n;try{const d={address_line:t.addressLine,city:t.city,state:t.state,pincode:t.pincode,country:t.country,mobile:parseInt(t.mobile.replace(/\D/g,"")),user_id:s.id},F=l?`https://cloudflare-d1.ujhuji.workers.dev/api/addresses/${l.id}`:"https://cloudflare-d1.ujhuji.workers.dev/api/addresses",{data:$}=await b[l?"put":"post"](F,d,g());h(w=>{const x=S($.data);return l?w.map(j=>j.id===x.id?x:j):[x,...w]}),o.success(l?"Dirección actualizada":"Dirección creada"),a(null)}catch(d){o.error(((n=(i=d.response)==null?void 0:i.data)==null?void 0:n.error)||"Error en la operación")}};return m?r("div",{className:"flex flex-col items-center justify-center h-screen",children:[e("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"}),e("p",{className:"mt-4 text-gray-600",children:"Cargando perfil..."})]}):s?r("div",{className:"max-w-6xl mx-auto p-4 relative",children:[e("header",{className:"text-center mb-8",children:r("h1",{className:"text-3xl font-bold flex items-center justify-center gap-2",children:[e(M,{})," Mi Perfil"]})}),r("div",{className:"grid md:grid-cols-2 gap-6",children:[e("section",{className:"bg-white p-6 rounded-xl shadow-lg",children:r("div",{className:"text-center",children:[e("img",{src:s.avatar||"/img1.png",alt:"Avatar",className:"w-32 h-32 rounded-full border-4 border-gray-100 mx-auto mb-4",onError:t=>t.target.src="/img1.png"}),e("h2",{className:"text-xl font-semibold",children:s.name}),e("p",{className:"text-gray-600 mt-2",children:s.email}),e("p",{className:"text-gray-600",children:s.mobile||"Sin teléfono registrado"}),r(A,{to:"/edit-profile",className:"mt-4 inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors",children:[e(k,{className:"mr-2"})," Editar Perfil"]})]})}),r("section",{className:"bg-white p-6 rounded-xl shadow-lg",children:[r("div",{className:"flex justify-between items-center mb-6",children:[r("h2",{className:"text-xl font-bold flex items-center gap-2",children:[e(z,{})," Mis Direcciones"]}),r("button",{onClick:()=>{N(null),a("address")},className:"bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center transition-colors",children:[e(I,{className:"mr-2"})," Nueva Dirección"]})]}),e("div",{className:"grid gap-4",children:f.length===0?e("p",{className:"text-gray-500 text-center py-4",children:"No hay direcciones registradas"}):f.map(t=>r("div",{className:"border rounded-xl p-4 relative hover:shadow-md transition-shadow",children:[r("div",{className:"pr-12",children:[e("h3",{className:"font-semibold",children:t.addressLine}),r("p",{className:"text-gray-600",children:[t.city,t.state&&`, ${t.state}`]}),r("p",{className:"text-gray-600",children:["C.P. ",t.pincode]}),e("p",{className:"text-gray-600",children:t.country}),r("p",{className:"text-gray-600",children:["Tel: ",t.mobile]})]}),r("div",{className:"absolute top-2 right-2 flex gap-2",children:[e("button",{className:"text-blue-500 hover:text-blue-700 transition-colors",onClick:()=>{N(t),a("address")},children:e(k,{})}),e("button",{className:"text-red-500 hover:text-red-700 transition-colors",onClick:()=>{v(t.id),a("delete")},children:e(P,{})})]})]},t.id))})]})]}),p&&r(T,{children:[e("div",{className:"fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"}),p==="delete"&&e("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4",children:r("div",{className:"bg-white rounded-xl p-6 max-w-md w-full shadow-2xl",children:[e("h3",{className:"text-lg font-bold mb-3",children:"¿Eliminar dirección?"}),e("p",{className:"text-gray-600 mb-5",children:"Esta acción no se puede deshacer"}),r("div",{className:"flex justify-end gap-3",children:[e("button",{onClick:()=>a(null),className:"px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors",children:"Cancelar"}),e("button",{onClick:C,className:"px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors",children:"Confirmar"})]})]})}),p==="address"&&e("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4",children:r("div",{className:"bg-white rounded-xl p-6 w-full max-w-md shadow-2xl",children:[r("div",{className:"flex justify-between items-center mb-4",children:[e("h3",{className:"text-lg font-bold",children:l?"Editar Dirección":"Nueva Dirección"}),e("button",{onClick:()=>a(null),className:"text-gray-500 hover:text-gray-700 transition-colors",children:"✕"})]}),e(U,{initialValues:l,onSubmit:E,onCancel:()=>a(null)})]})})]})]}):r("div",{className:"text-center p-8",children:[e("p",{className:"text-red-500 mb-4",children:"Debes iniciar sesión para ver esta página"}),e(A,{to:"/login",className:"bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600",children:"Ir al login"})]})};export{H as default};
