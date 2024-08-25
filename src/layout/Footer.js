import { CDBBox, CDBBtn, CDBIcon, CDBLink, CDBSidebarFooter } from "cdbreact";

const Footer = () => {
    return (<CDBSidebarFooter className="shadow mt-3" color="dark">
            <CDBBox display="flex" flex="column" className="mx-auto py-5" style={{ width: '90%' }}>
                <CDBBox display="flex" justifyContent="between" className="flex-wrap">
                    <CDBBox>
                        <a href="/" className="d-flex align-items-center p-0 text-dark">
                            <img src="https://cdn-icons-png.flaticon.com/512/4762/4762311.png" alt="logo"  width="100px" />
                            <span className="ms-3 h5 font-weight-bold">HTN-LBN</span>
                        </a>
                        <p className="my-3" style={{ width: '250px' }}>
                        “Kiến thức trong tầm tay, tương lai trong tầm với”
                        </p>
                        <CDBBox display="flex" className="mt-4">
                            <CDBBtn flat color="dark">
                                <CDBIcon fab icon="facebook-f" />
                            </CDBBtn>
                            <CDBBtn flat color="dark" className="mx-3">
                                <CDBIcon fab icon="twitter" />
                            </CDBBtn>
                            <CDBBtn flat color="dark" className="p-2">
                                <CDBIcon fab icon="instagram" />
                            </CDBBtn>
                        </CDBBox>
                    </CDBBox>
                    <CDBBox>
                        <p className="h5 mb-4" style={{ fontWeight: '600' }}>
                            HTN-LBN
                        </p>
                        <CDBBox flex="column" style={{ cursor: 'pointer', padding: '0' }}>
                            <CDBLink href="/">Resources</CDBLink>
                            <CDBLink href="/">About Us</CDBLink>
                            <CDBLink href="/">Contact</CDBLink>
                            <CDBLink href="/">Blog</CDBLink>
                        </CDBBox>
                    </CDBBox>
                    <CDBBox>
                        <p className="h5 mb-4" style={{ fontWeight: '600' }}>
                            Help
                        </p>
                        <CDBBox flex="column" style={{ cursor: 'pointer', padding: '0' }}>
                            <CDBLink href="/">Support</CDBLink>
                            <CDBLink href="/">Sign Up</CDBLink>
                            <CDBLink href="/">Sign In</CDBLink>
                        </CDBBox>
                    </CDBBox>
                    <CDBBox>
                        <p className="h5 mb-4" style={{ fontWeight: '600' }}>
                            Products
                        </p>
                        <CDBBox flex="column" style={{ cursor: 'pointer', padding: '0' }}>
                            <CDBLink href="/">Windframe</CDBLink>
                            <CDBLink href="/">Loop</CDBLink>
                            <CDBLink href="/">Contrast</CDBLink>
                        </CDBBox>
                    </CDBBox>
                </CDBBox>
                <small className="text-center mt-5">&copy; Devwares, 2020. All rights reserved.</small>
            </CDBBox>
    </CDBSidebarFooter>)
}

export default Footer;