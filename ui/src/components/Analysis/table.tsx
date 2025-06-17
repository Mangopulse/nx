// import {
//     Table,
//     TableBody,
//     TableCaption,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
//   } from "@/components/ui/table"
  
//   interface top_articles  {
//     article_id: number;
//     article_title: string; 
//     pageviews_from_clicks: number; 
//   }
//   const schema ={
//     TableCaption:"A list of your recent views.",
//     TableRow:[
//     {  row :"article_id",},
//     {  row:"article_title",},
//      { row:"pageviews_from_clicks",}
    
//     ],
//   }
  
//   export function TableDemo({tableContent,schema}: any) {
//     return (
//       <Table>
//         <TableCaption>{schema.TableCaption}</TableCaption>
//         <TableHeader>
//           <TableRow className="w-[100px]">
//             {schema.TableRow.map((row :any ,index : number)=>
//               <TableHead key={index}>{row.row}</TableHead>
//             )}
            
          
           
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {tableContent.map((article :top_articles,index :number) => (
//             <TableRow key={index}>
//               <TableCell className="font-medium">{article.article_id}</TableCell>
//               <TableCell>{article.article_title}</TableCell>
//               <TableCell>{article.pageviews_from_clicks}</TableCell>
             
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     )
//   }
  