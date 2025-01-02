// import React from 'react';
// import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// // Define the PDFDocument component
// const PDFDocument = ({ quotations, requestCode, companyLogo }) => {
//     const styles = StyleSheet.create({
//         page: {
//             flexDirection: 'column',
//             padding: 20,
//             fontSize: 12,
//             fontFamily: 'Helvetica',
//             backgroundColor: '#f5f5f5',
//         },
//         logoContainer: {
//             alignItems: 'center',
//             marginBottom: 20,
//         },
//         logo: {
//             width: 120,
//             height: 120,
//         },
//         header: {
//             fontSize: 18,
//             fontWeight: 'bold',
//             textAlign: 'center',
//             marginBottom: 20,
//             color: '#333',
//         },
//         section: {
//             marginBottom: 20,
//         },
//         table: {
//             display: 'table',
//             width: '100%',
//             borderCollapse: 'collapse',
//             marginBottom: 20,
//         },
//         tableHeader: {
//             backgroundColor: '#007BFF',
//             color: '#fff',
//             fontWeight: 'bold',
//             textAlign: 'center',
//             padding: 8,
//         },
//         tableRow: {
//             flexDirection: 'row',
//             borderBottom: '1px solid #ddd',
//         },
//         tableCell: {
//             padding: 8,
//             textAlign: 'center',
//             fontSize: 12,
//             color: '#333',
//         },
//         tableRowOdd: {
//             backgroundColor: '#f9f9f9',
//         },
//         tableRowEven: {
//             backgroundColor: '#fff',
//         },
//         totalAmount: {
//             fontWeight: 'bold',
//             fontSize: 14,
//             marginTop: 20,
//         },
//         footer: {
//             marginTop: 30,
//             textAlign: 'center',
//             fontSize: 10,
//             color: '#777',
//         },
//     });

//     return (
//         <Document>
//             <Page size="A4" style={styles.page}>
//                 {/* Company Logo */}
//                 <View style={styles.logoContainer}>
//                     <Image
//                         src={companyLogo} // Pass the logo as a prop
//                         style={styles.logo}
//                     />
//                 </View>

//                 {/* Header */}
//                 <Text style={styles.header}>Quotation for Request Code: {requestCode}</Text>

//                 {/* Quotation Details */}
//                 <View style={styles.section}>
//                     <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>Quotation Details</Text>

//                     <View style={styles.table}>
//                         <View style={styles.tableRow}>
//                             <Text style={[styles.tableCell, styles.tableHeader]}>Product Name</Text>
//                             <Text style={[styles.tableCell, styles.tableHeader]}>Quantity</Text>
//                             <Text style={[styles.tableCell, styles.tableHeader]}>Available Quantity</Text>
//                             <Text style={[styles.tableCell, styles.tableHeader]}>Price</Text>
//                         </View>
//                         {quotations.map((item, index) => (
//                             <View
//                                 style={[
//                                     styles.tableRow,
//                                     index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
//                                 ]}
//                                 key={index}
//                             >
//                                 <Text style={styles.tableCell}>{item.product_name}</Text>
//                                 <Text style={styles.tableCell}>{item.quantity}</Text>
//                                 <Text style={styles.tableCell}>{item.available_quantity}</Text>
//                                 <Text style={styles.tableCell}>{item.total_price}</Text>
//                             </View>
//                         ))}
//                     </View>
//                 </View>

//                 {/* Total Amount */}
//                 <View style={styles.totalAmount}>
//                     <Text>
//                         Total Amount: {quotations.reduce((acc, curr) => acc + (curr.total_price || 0), 0)} USD
//                     </Text>
//                 </View>

//                 {/* Footer */}
//                 <View style={styles.footer}>
//                     <Text>Thank you for your business!</Text>
//                 </View>
//             </Page>
//         </Document>
//     );
// };

// export default PDFDocument;
