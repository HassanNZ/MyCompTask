import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.loadData();
        //your functions go here
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        //this.loadData(() =>
        //    this.setState({ loaderData })
        //)

        //console.log(this.state.loaderData)
    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        var link = 'http://localhost:51689/listing/listing/getEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
        console.log("your ajax call and other logic goes here");
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                if (res.success == true) {
                    console.log("this is from jobdata " + res.myJobs);
                    
                    this.setState({ loadJobs: res.myJobs })
                    
                } else {
                    TalentUtil.notification.show(res.message, "error", null, null)
                }
            }.bind(this)
        })
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    render() {
        const Joblist = this.state.loadJobs.map(function (item, i) {
            console.log('item :' + item.summary + ' i : '+i);
           
        });
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">



                    {Joblist}
                    

                    <div >
                        <i className="filter icon"></i> Filter :<strong>Choose Filter</strong><i className="sort down icon" />
                        <i className="calendar alternate icon"></i> Sort by date:<strong> Newest first</strong><i className="sort down icon" />
                    </div>


                    <div> {this.state.loadJobs.length == 0 && <h4>No Jobs Found !</h4>}</div>
                    <div> {this.state.loadJobs.length > 0 &&

                        <div className="ui cards" >
                        {this.state.loadJobs.map((item) =>


                            <div className="card" key={item.id} id="mycard">
                            <div className="content">
                                    <div className="header">
                                       {item.title}
                                    </div>
                                    
                                    <a class="ui black right ribbon label"><i class="user icon"></i>0</a>
                                    <div className="meta">
                                        {item.location.city + " , " + item.location.country}
                                    </div>
                                    
                                <div className="description">
                                        {item.summary}
                                       </div>
                                </div>
                            <div className="extra content">

                                    <button className="negative ui button" id="Expired_btn">Expired</button>
                                    <div className="ui blue basic buttons" id="MyThreebtn">

                                        <div className="ui button" ><i class="ban icon"></i>Close</div>
                                        <div className="ui button"><i class="edit outline icon"></i>Edit</div>
                                        <div className="ui button"><i class="copy outline icon"></i>Copy</div>
                                    </div>
                                </div>

                            </div>
                         )
                        }

                      
                       
                        </div>

                        



                    }
                    </div>
                    <div id="Pagination">
                        <Pagination
                            defaultActivePage={1}
                            ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                            firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                            lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                            prevItem={{ content: <Icon name='angle left' />, icon: true }}
                            nextItem={{ content: <Icon name='angle right' />, icon: true }}
                            totalPages={1}
                        />
                    </div>



                    </div>
            </BodyWrapper>
        )
    }
}