// import {
//   Route,
//   RouterProvider,
//   createBrowserRouter,
//   createRoutesFromElements,
// } from 'react-router-dom';
//
// import { LoanCompare } from '@features/loan-compare/containers/LoanCompare';
// import { Roi } from '@features/roi-table/containers/Roi';
//
// import { LayoutWithOutlet } from '@/common/components/Layout';
import { Home } from '@/common/containers/Home';

// export default function Routes() {
//   const router = createBrowserRouter(
//     createRoutesFromElements(
//       <Route element={<LayoutWithOutlet />}>
//         <Route index element={<Home />} />
//         <Route path="loan-compare" element={<LoanCompare />} />
//         <Route path="admin/login" element={<Roi />} />
//       </Route>,
//     ),
//   );
//   return <RouterProvider router={router} />;
// }

export default function Routes() {
  return <Home />;
}
