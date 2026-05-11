import bodyParser from 'body-parser';
import Express from 'express';
import { verifyAdminToken, verifyEmpAdmToken, verifyEmployeeToken, verifyGeneralToken, verifyUserToken } from '../authentication/auth.js';
import {
  deleteApplication,
  deleteApply,
  deleteAuthor,
  deleteBook,
  deleteEdition,
  deleteEmployee,
  deleteGenre,
  deleteJob,
  deleteMessage,
  deletePublisher,
  deleteRatRevBook,
  deleteRequest,
  deleteRequests,
  resignAdmin,
  resignEmployee
} from '../controllers/deleteController.js';
import {
  getAllBook,
  getAllBookSum,
  getAllLanguages,
  getAllNews,
  getAllRatRevOfBook,
  getAllRequests,
  getAllUsers,
  getApplication,
  getAuthor,
  getBookDetailsByID,
  getEdition,
  getEmployee,
  getFineData,
  getGenre,
  getJob,
  getMyFineHistory,
  getMyMessages,
  getMyRentHistory,
  getMyRequests,
  getNews,
  getOwnRatRev,
  getPublisher,
  getRanges,
  getRentData,
  getRentHistory,
  getRunningFine,
  getSearchBar,
  getUserDetails
} from '../controllers/getController.js';
import { loginGeneral, logout, postAdmin, postUser } from '../controllers/loginController.js';
import {
  acceptApplication,
  acceptRequest,
  addAuthor,
  addBookGenre,
  addEdition,
  addGenre,
  addJob,
  addPublisher,
  addRequest,
  addWrittenBy,
  applyForJob,
  postBook,
  postFavBook,
  publishNews,
  ratrevBook,
  sendMessage
} from '../controllers/postController.js';
import {
  updateAuthor,
  updateBook,
  updateEdition,
  updateGenre,
  updateHistory,
  updateJob,
  updateMessage,
  updatePublisher,
  updateUser
} from '../controllers/putController.js';
import { addLoanItem, createLoan, createReader, getDashboard, importBook, liquidateBook, listBooks, listLoans, listReaders, returnLoan } from '../controllers/hqtcsdlController.js';

const router = Express.Router();
router.use(Express.json());
let urlencodedParser = bodyParser.urlencoded({extended: true});

router.route('/book')
  .get(verifyGeneralToken, getBookDetailsByID)
  .post(verifyEmpAdmToken, urlencodedParser, postBook)
  .put(verifyEmpAdmToken, urlencodedParser, updateBook)
  .delete(verifyEmpAdmToken, deleteBook);
router.route('/getEdition')
  .get(verifyGeneralToken, getEdition)
  .post(verifyEmpAdmToken, urlencodedParser, addEdition)
  .put(verifyEmpAdmToken, urlencodedParser, updateEdition)
  .delete(verifyEmpAdmToken, deleteEdition)
router.route('/writtenBy')
  .post(verifyEmpAdmToken, urlencodedParser, addWrittenBy)
router.route('/book-genre')
  .post(verifyEmpAdmToken, urlencodedParser, addBookGenre)

router.route('/getPublisher')
  .get(verifyGeneralToken, getPublisher)
  .post(verifyEmpAdmToken, urlencodedParser, addPublisher)
  .put(verifyEmpAdmToken, urlencodedParser, updatePublisher)
  .delete(verifyEmpAdmToken, deletePublisher)
router.route('/getAuthor')
  .get(verifyGeneralToken, getAuthor)
  .post(verifyEmpAdmToken, urlencodedParser, addAuthor)
  .put(verifyEmpAdmToken, urlencodedParser, updateAuthor)
  .delete(verifyEmpAdmToken, deleteAuthor)
router.route('/getGenre')
  .get(verifyGeneralToken, getGenre)
  .post(verifyEmpAdmToken, urlencodedParser, addGenre)
  .put(verifyEmpAdmToken, urlencodedParser, updateGenre)
  .delete(verifyEmpAdmToken, deleteGenre)
router.route('/getLanguage').get(verifyGeneralToken, getAllLanguages);

router.route('/user/signup').post(urlencodedParser, postUser);
router.route('/user/login').post(urlencodedParser, loginGeneral);
router.route('/user/update').put(verifyUserToken, urlencodedParser, updateUser);
router.route('/user/details').get(verifyUserToken, getUserDetails);
router.route('/all-users').get(verifyEmpAdmToken, getAllUsers);
router.route('/admin/signup').post(verifyAdminToken, urlencodedParser, postAdmin);
router.route('/admin/resign').delete(verifyAdminToken, resignAdmin);

router.route('/employee/resign').delete(verifyEmployeeToken, resignEmployee);
router.route('/employee')
  .get(verifyAdminToken, getEmployee)
  .delete(verifyAdminToken, deleteEmployee);
router.route('/getRanges').get(verifyGeneralToken, getRanges);
router.route('/all-book').get(verifyGeneralToken, getAllBook);
router.route('/all-books-sum').get(verifyGeneralToken, urlencodedParser, getAllBookSum);
router.route('/search-bar').get(verifyGeneralToken, urlencodedParser, getSearchBar);
router.route('/my-requests').get(verifyUserToken, getMyRequests);
router.route('/request').post(verifyUserToken, urlencodedParser, addRequest);
router.route('/del-requests').delete(verifyUserToken, deleteRequests);
router.route('/my-rent-history').get(verifyUserToken, getMyRentHistory);
router.route('/my-fine-history').get(verifyUserToken, getMyFineHistory);
router.route('/return-book').put(verifyUserToken, urlencodedParser, updateHistory);
router.route('/all-requests').get(verifyEmpAdmToken, getAllRequests);
router.route('/handle-request').post(verifyEmpAdmToken, urlencodedParser, acceptRequest).delete(verifyEmpAdmToken, deleteRequest);
router.route('/all-fine').get(verifyEmpAdmToken, getRunningFine);
router.route('/all-rent').get(verifyEmpAdmToken, getRentHistory);
router.route('/rent-data').get(verifyAdminToken, getRentData);
router.route('/fine-data').get(verifyAdminToken, getFineData);
router.route('/logout').get(verifyUserToken, logout);

router.route('/hqtcsdl/dashboard').get(getDashboard);
router.route('/hqtcsdl/books').get(listBooks);
router.route('/hqtcsdl/readers').get(listReaders).post(urlencodedParser, createReader);
router.route('/hqtcsdl/loans').get(listLoans).post(urlencodedParser, createLoan);
router.route('/hqtcsdl/loan-items').post(urlencodedParser, addLoanItem);
router.route('/hqtcsdl/return').post(urlencodedParser, returnLoan);
router.route('/hqtcsdl/import-book').post(urlencodedParser, importBook);
router.route('/hqtcsdl/liquidate-book').post(urlencodedParser, liquidateBook);

export default router;
