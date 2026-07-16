// import { Map, Marker } from '@vis.gl/react-google-maps'
// import { MapPin, Phone, Mail } from 'lucide-react'

// // Replace with your branch's real coordinates
// const BRANCH_COORDS = { lat: 9.0192, lng: 38.7525 } // Bole Road, Addis Ababa placeholder

// export default function LocationSection() {
//   const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

//   return (
//     <section className="py-20 px-6 bg-card border-y border-border">
//       <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
//         <div>
//           <h2 className="text-3xl font-bold text-foreground mb-6">Find us</h2>
//           <div className="space-y-4">
//             <div className="flex items-start gap-3">
//               <MapPin size={18} className="text-primary mt-0.5" />
//               <p className="text-sm text-foreground">Bole Road, Addis Ababa, Ethiopia</p>
//             </div>
//             <div className="flex items-start gap-3">
//               <Phone size={18} className="text-primary mt-0.5" />
//               <p className="text-sm text-foreground">+251 91 234 5678</p>
//             </div>
//             <div className="flex items-start gap-3">
//               <Mail size={18} className="text-primary mt-0.5" />
//               <p className="text-sm text-foreground">hello@mrcafe.com</p>
//             </div>
//           </div>
//         </div>

//         <div className="rounded-2xl overflow-hidden border border-border h-72">
//           {apiKey ? (
//             <Map defaultCenter={BRANCH_COORDS} defaultZoom={15} disableDefaultUI={false}>
//               <Marker position={BRANCH_COORDS} />
//             </Map>
//           ) : (
//             <div className="w-full h-full flex items-center justify-center text-xs text-center px-6" style={{ color: '#B58B67' }}>
//               Add VITE_GOOGLE_MAPS_API_KEY to .env to show the live map
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   )
// }