// "use client"

// import { useEffect, useState } from "react"



// export function useProducts(){


//   const [products, setProducts] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const cached = localStorage.getItem(CACHE_KEY)
//     if (cached) {
//       setProducts(JSON.parse(cached))
//       setLoading(false)
//     }

//     const fetchProducts = async () => {
//       try {
//         const supabase = createClienti()
//         const { data, error } = await supabase
//           .from("products")
//           .select("*")
//           .eq("is_active", true)
//           .order("created_at", { ascending: false })
//           .limit(3)

//         if (error) throw error

//         if (data) {
//           setProducts(data)
//           localStorage.setItem(CACHE_KEY, JSON.stringify(data))
//         }
//       } catch (err: any) {
//         setError("Failed to load products.")
//         console.error(err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     // fetch in background after cache
//     fetchProducts()
// }
