/**
 * INSPINIA - Responsive Admin Theme
 *
 */
(function () {
    angular.module('inspinia', [
        'ui.router',                    // Routing
        'oc.lazyLoad',                  // ocLazyLoad
        'ui.bootstrap',                 // Ui Bootstrap
        'pascalprecht.translate',       // Angular Translate
        'ngIdle',                       // Idle timer
        'ngSanitize',                    // ngSanitize
        'ngResource'
    ])
        .constant('Config', {
            baseURL : 
         'http://localhost:3706/api/',
         // 'http://magpie-qa-api.us-west-2.elasticbeanstalk/api/',
            authURL : 'http://development.pyinagztvy.us-west-2.elasticbeanstalk.com/oauth/token',
            oldMagpieBaseURL : 'http://magpie-sandbox.azurewebsites.net/Landing/index?n='
        })
        .constant('USER_ROLES', {
            all : '*',
            admin : 'admin',
            editor : 'editor',
            guest : 'guest',
            QlikDashboardUser : 'QlikDashboardUser',
            OldTroutUser : 'OldTroutUser',
            MagpieLiteTaskBoardUser : 'MagpieLiteTaskBoardUser'
        })
        .constant("baseURL", "http://localhost:3706/api/")
        .service('filterService', ['$resource', 'baseURL', 'Config', function ($resource, baseURL, Config) {
            var filterList = $resource(Config.baseURL + 'Filters').query(),
                count = 0,
                addFilter = function (newObj) {
                    filterList.push(newObj);
                },
                addFilterToList = function (newObj, list) {
                    list.push(newObj);
                },
                getFilters = function () {
                    return filterList;
                },
                deleteFilter = function (obj) {
                    var index = filterList.indexOf(obj);
                    filterList.splice(index, 1);
                },
                getCount = function () {
                    count = 0;
                    angular.forEach(filterList, function (filter) {
                        count = count + 1;
                    });
//                    alert(count);
                    return count;
                },
                setCount = function (val) {
                    count = val;
                },
                editFilter = function (newObj) {
                    angular.forEach(filterList, function (item) {
                        if (item.FilterName === newObj.FilterName) {
                            item.Params = newObj.Params;
                        }
                    });
                };
            return {
                addFilter: addFilter,
                addFilterToList: addFilterToList,
                getFilters: getFilters,
                editFilter: editFilter,
                deleteFilter: deleteFilter,
                getCount : getCount,
                setCount : setCount
            };

        }])
        .service('userService', ['$resource', 'baseURL', 'Config', '$interpolate', function ($resource, baseURL, Config, $interpolate) {
            this.getUserData = function (bearerToken, userId) {
                var exp = $interpolate(Config.baseURL + 'CurrentUser/{{BearerToken}}}', false, null, true),
                    url = exp({ BearerToken: bearerToken}),
                    promise,
                //  promise = $http.get(url);
                //  return promise.then(function (data) {
                //  //  alert(data);
                //  return data;
                //   });
                    userRoles = [];
                if (userId === 'Rob') {
                    userRoles.push('QlikDashboardUser');
                    userRoles.push('admin');
                } else if (userId === 'Ed') {
                    userRoles.push('admin');
                    userRoles.push('OldTroutUser');
                } else {
                    userRoles.push('admin');
                    userRoles.push('MagpieLiteTaskBoardUser');
                }
                var userData = {
                    userRoles : userRoles
                }
                return userData;
            };
        }])
        .service('responsibleUserService', ['$resource', 'baseURL', 'Config', function ($resource, baseURL, Config) {
            var userList = $resource(Config.baseURL + 'Users', null, {
                query: {
                    method: 'GET',
                    transformResponse: function (data) {
                        return angular.fromJson(data);
                    },
                    isArray: true
                }
            }).query(),
                getUsers = function () {
                    return userList;
                };
            return {
                getUsers : getUsers
            };
        }])
        .service('tasksWebAPIService', ['$http', '$interpolate', function ($http, $interpolate) {
            var promise,
                myService = {
                    async: function () {
                        if (!promise) {
                            // $http returns a promise, which has a then function, which also returns a promise
                            promise = $http.get('test.json').then(function (response) {
                            // The then function here is an opportunity to modify the response
//                                console.log(response);
                                // The return value gets picked up by the then in the controller.
                                return response.data;
                            });
                        }
                                  // Return the promise to the controller
                        return promise;
                    }
                };
            return myService;
        }])
        .service('plotterSrv', ['$http', function ($http) {
            return {
                getData: function () {
            // 1)
            // Asyncronous request to get the data.

            // ?
            // How could I update the revenues array?
                    var promise = $http({method : 'GET', url : 'http://magpie-sandbox-api.us-west-2.elasticbeanstalk.com/api/Filters'})
                                .success(function (data, status, headers, config) {
                                return data;
                            })
                            .error(function (data, status, headers, config) {
                                return {"status": false};
                            });

                    return promise;
                },
                drawPlot: function (d) {
            // 1)
            // plot the data.
                    var dataObj = {
                        "FilterId": 6,
                        "FilterName": "Filter ABCDEF",
                        "FilterOwnerUserId": "B981D6E6-FC59-4C02-A1D4-7E1038FC5E95",
                        "FilterTypeId": 1,
                        "FilterType": "System",
                        "AssignedStatusId": null,
                        "ControlId": null,
                        "ControlSetId": null,
                        "DueStatusId": 2,
                        "IncludeRelations": null,
                        "ResponsibleUserId": null,
                        "TaskStateId": null,
                        "UserTaskCode": null,
                        "UserTaskId": null,
                        "WorkingSetId": null
                    };
                    d.push(dataObj);
                }
            };
        }])
        .service('dataService', ['$http', '$interpolate', 'baseURL', 'Config', function ($http, $interpolate, baseURL, Config) {
            this.getData = function (workingSetId, filterId) {
                var exp = $interpolate(Config.baseURL + 'WorkingSets/{{WorkingSetId}}/Tasks?filterId={{FilterId}}', false, null, true),
                    url = exp({ WorkingSetId: workingSetId, FilterId : filterId}),
                    promise;
                promise = $http.get(url);
                return promise.then(function (data) {
                    //  alert(data);
                    return data;
                });
            };
        }])
        
        .service('filterWebAPIService', ['$http', 'baseURL', 'Config', function ($http, baseURL, Config) {
            this.getData = function () {
                var  promise;
                promise = $http.get(Config.baseURL + 'Filters');
                return promise.then(function (data) {
                    //  alert(data);
                    return data;
                });
               
            };
            
        }])
        
        .service('workingSetWebAPIService', ['$http', '$interpolate', 'baseURL', 'Config', function ($http, $interpolate, baseURL, Config) {
            this.getData = function () {
                var  promise;
                promise = $http.get(Config.baseURL + 'WorkingSets');
                return promise.then(function (data) {
                    //  alert(data);
                    return data;
                });
            };
            this.getWorkingsetNamebyId = function (id, workingSet) {
                var data = '';
                angular.forEach(workingSet, function (item) {
                    if (item.workingSetId == id) {
                        data = item.name;
                    }
                });
                return data;
            };
            this.getControlCatalgueByWorkingSetId = function (id, workingSet) {
                var catalogue = [];
                angular.forEach(workingSet, function (item) {
                    if (item.workingSetId == id) {
                        angular.forEach(item.workingSetTemplate.controlSets, function (controlSet) {
                            catalogue.push(controlSet);
//                           alert(catalogue);
                        });
                    }
                });
                return catalogue;
            };
            
        }])
    
        .service('tasksService', ['$resource', 'baseURL', 'Config', function ($resource, baseURL, Config) {
            var tasksList = [{
                TaskCategory: 'CompletedUserTasks',
                Tasks : [
                    {
                        Completed: 'yes',
                        ControlCode: 'AC-1',
                        Due: '1/17/2017',
                        DueStatus: 'OnTime',
                        Id: '3',
                        ResponsibleUsername: 'emendoza',
                        Source: 'Nist',
                        TaskState: 'Completed',
                        Title: 'Distribute Access Control Policy'
                    },
                    {
                        Completed: 'yes',
                        ControlCode: 'AC-1',
                        Due: '1/15/2017',
                        DueStatus: 'OnTime',
                        Id: '3',
                        ResponsibleUsername: 'emendoza',
                        Source: 'Nist',
                        TaskState: 'Completed',
                        Title: 'Enforce approved authorizations'
                    },
                    {
                        Completed: 'yes',
                        ControlCode: 'AC-1',
                        Due: '1/6/2017',
                        DueStatus: 'InJeopardy',
                        Id: '3',
                        ResponsibleUsername: 'emendoza',
                        Source: 'Nist',
                        TaskState: 'Completed',
                        Title: 'Establish Usage Restrictions for Remote Access'
                    },
                    {
                        Completed: 'yes',
                        ControlCode: 'AC-1',
                        Due: '12/30/2016',
                        DueStatus: 'OverDue',
                        Id: '3',
                        ResponsibleUsername: 'emendoza',
                        Source: 'Nist',
                        TaskState: 'Completed',
                        Title: 'Retain User Acknowledgement of Privacy and Security Notices'
                    }
                ]
            },
                {
                    TaskCategory: 'InProgressUserTasks',
                    Tasks : [
                        {
                            Completed: 'yes',
                            ControlCode: 'AC-1',
                            Due: '12/30/2016',
                            DueStatus: 'OverDue',
                            Id: '3',
                            ResponsibleUsername: 'emendoza',
                            Source: 'Nist',
                            TaskState: 'In Progress',
                            Title: 'Distribute Access Control Procedures'
                        },
                        {
                            Completed: 'yes',
                            ControlCode: 'AC-2',
                            Due: '1/7/2017',
                            DueStatus: 'InJeopardy',
                            Id: '4',
                            ResponsibleUsername: 'jchapman',
                            Source: 'Nist',
                            TaskState: 'In Progress',
                            Title: 'Establish a Process for Reissuing Credentials'
                        },
                        {
                            Completed: 'yes',
                            ControlCode: 'AC-1',
                            Due: '1/30/2017',
                            DueStatus: 'OnTime',
                            Id: '5',
                            ResponsibleUsername: 'UnAssigned',
                            Source: 'Nist',
                            TaskState: 'In Progress',
                            Title: 'Distribute Access Control Policy'
                        },
                        {
                            Completed: 'yes',
                            ControlCode: 'AC-1',
                            Due: '1/10/2017',
                            DueStatus: 'OnTime',
                            Id: '6',
                            ResponsibleUsername: 'emendoza',
                            Source: 'Nist',
                            TaskState: 'In Progress',
                            Title: 'Notify Account Managers'
                        },
                        {
                            Completed: 'yes',
                            ControlCode: 'AC-1',
                            Due: '1/9/2017',
                            DueStatus: 'InJeopardy',
                            Id: '7',
                            ResponsibleUsername: 'emendoza',
                            Source: 'Nist',
                            TaskState: 'In Progress',
                            Title: 'Display Privacy and Security Notices'
                        },
                        {
                            Completed: 'yes',
                            ControlCode: 'AC-1',
                            Due: '1/9/2017',
                            DueStatus: 'InJeopardy',
                            Id: '8',
                            ResponsibleUsername: 'emendoza',
                            Source: 'Nist',
                            TaskState: 'In Progress',
                            Title: 'Enforce approved authorizations'
                        },
                        {
                            Completed: 'yes',
                            ControlCode: 'AC-17',
                            Due: '1/15/2017',
                            DueStatus: 'OnTime',
                            Id: '9',
                            ResponsibleUsername: 'UnAssigned',
                            Source: 'Nist',
                            TaskState: 'In Progress',
                            Title: 'Authorize Remote Access'
                        },
                        {
                            Completed: 'yes',
                            ControlCode: 'AC-20',
                            Due: '1/7/2017',
                            DueStatus: 'InJeopardy',
                            Id: '10',
                            ResponsibleUsername: 'UnAssigned',
                            Source: 'Nist',
                            TaskState: 'In Progress',
                            Title: 'Establish Terms and Conditions'
                        }
                    ]
                },
                {
                    TaskCategory: 'NewUserTasks',
                    Tasks : [
                        {
                            Completed: 'yes',
                            ControlCode: 'AC-2',
                            Due: '1/11/2017',
                            DueStatus: 'OnTime',
                            Id: '11',
                            ResponsibleUsername: 'ralexander',
                            Source: 'Nist',
                            TaskState: 'New',
                            Title: 'Assign Account Managers'
                        },
                        {
                            Completed: 'yes',
                            ControlCode: 'AC-2',
                            Due: '1/8/2017',
                            DueStatus: 'InJeopardy',
                            Id: '12',
                            ResponsibleUsername: 'UnAssigned',
                            Source: 'Nist',
                            TaskState: 'New',
                            Title: 'Establish Conditions for Membership'
                        },
                        {
                            Completed: 'yes',
                            ControlCode: 'AC-2',
                            Due: '12/30/2016',
                            DueStatus: 'OverDue',
                            Id: '13',
                            ResponsibleUsername: 'emendoza',
                            Source: 'Nist',
                            TaskState: 'OverDue',
                            Title: 'Review Access Control Procedures'
                        },
                        {
                            Completed: 'yes',
                            ControlCode: 'AC-1',
                            Due: '1/10/2017',
                            DueStatus: 'OnTime',
                            Id: '14',
                            ResponsibleUsername: 'emendoza',
                            Source: 'Nist',
                            TaskState: 'New',
                            Title: 'Manage Administration of Information System Accounts'
                        }]
                }],

                addTask = function (newObj) {
                    tasksList.push(newObj);
                },
                getTasks = function () {
                    return tasksList;
                },
                getTasksByCategory = function (category) {
                    var data;
                    angular.forEach(tasksList, function (item) {
                        if (item.TaskCategory === category) {
                            data = item;
                        }
                    });
                    return data;
                },
                getTasksByTaskState = function (category, taskList1) {
                    var data = [];
                    angular.forEach(taskList1, function (item) {
                        if (item.taskState.id == category) {
                            data.push(item);
                        }
                    });
                    return data;
                };

            return {
                addTask: addTask,
                getTasks: getTasks,
                getTasksByCategory: getTasksByCategory,
                getTasksByTaskState: getTasksByTaskState
            };

        }])
        .filter("dateRange", ['$filter', function ($filter) {
            return function (items, fromDate, toDate) {
                var filtered = [], from_date, to_date;
                if (((angular.isUndefined(fromDate)) || fromDate === null) || ((angular.isUndefined(toDate)) || toDate === null)) {
                    filtered = items;
                } else {
                    from_date = $filter('date')(new Date(fromDate), 'yyyy-MM-dd');
                    to_date = $filter('date')(new Date(toDate), 'yyyy-MM-dd');
                    angular.forEach(items, function (item) {
                        if (item.Due > from_date && item.Due < to_date) {
                            filtered.push(item);
                        }
                    });
                }
                return filtered;
            };
        }])
        .filter("controlTitleAndCode", ['$filter', function ($filter) {
            return function (items, searchControlOrCode) {
                var filtered = [], searchVal;
                if (angular.isUndefined(searchControlOrCode) || searchControlOrCode === null) {
                    filtered = items;
                } else {
                    searchVal = searchControlOrCode.toLowerCase();
                    angular.forEach(items, function (item) {
                        var control = item.ControlTitle.toLowerCase(), code = item.ControlCode.toLowerCase();
                        if (control.indexOf(searchVal) >= 0 || code.indexOf(searchVal) >= 0) {
                            filtered.push(item);
                        }
                    });
                }
                return filtered;
            };
        }])
        .filter("taskTitleAndCode", ['$filter', function ($filter) {
            return function (items, searchTitleOrCode) {
                var filtered = [], searchVal;
                if (angular.isUndefined(searchTitleOrCode) || searchTitleOrCode === null) {
                    filtered = items;
                } else {
                    searchVal = searchTitleOrCode.toLowerCase();
                    angular.forEach(items, function (item) {
                        var title = item.Title.toLowerCase(), code = item.Code.toLowerCase();
                        if (title.indexOf(searchVal) >= 0 || code.indexOf(searchVal) >= 0) {
                            filtered.push(item);
                        }
                    });
                }
                return filtered;
            };
        }])
        .filter("freeFormat", ['$filter', function ($filter) {
            return function (items, searchValue) {
                var filtered = [], searchVal;
                if (angular.isUndefined(searchValue) || searchValue === null) {
                    filtered = items;
                } else {
                    searchVal = searchValue.toLowerCase();
                    angular.forEach(items, function (item) {
                        var taskCode = item.Code.toLowerCase(),
                            controlTitle = item.ControlTitle.toLowerCase(),
                            controlCode = item.ControlCode.toLocaleLowerCase();
                        if (taskCode.indexOf(searchVal) >= 0 || controlTitle.indexOf(searchVal) >= 0 || controlCode.indexOf(searchVal) >= 0) {
                            filtered.push(item);
                        }
                    });
                }
                return filtered;
            };
        }])
        .filter("responsibleUser", ['$filter', function ($filter) {
            return function (items, responsibleUser) {
               // alert(responsibleUser);
                var filtered = [], user;
                if (angular.isUndefined(responsibleUser) || responsibleUser === null || responsibleUser.UserName  === ' ') {
                    filtered = items;
                } else {
                    user = responsibleUser.UserName.toLowerCase();
                    angular.forEach(items, function (item) {
                        if (item.ResponsibleUser != null) {
                            var respUser = item.ResponsibleUser.UserName.toLowerCase();
                            if (!(angular.isUndefined(respUser)) && !(respUser === null)) {
                                if (respUser  === user) {
                                    filtered.push(item);
                                }
                            }
                        }
                    });
                }
                return filtered;
            };
        }])
        .filter("controlCatalogue", ['$filter', function ($filter) {
            return function (items, controlCatalogueId) {
                var filtered = [];
                if (angular.isUndefined(controlCatalogueId) || controlCatalogueId === null || controlCatalogueId == 0) {
                    filtered = items;
                } else {
                    angular.forEach(items, function (item) {
                        if (item.ControlSetId == controlCatalogueId) {
                            filtered.push(item);
                        }
                    });
                }
                return filtered;
            };
        }])
        .filter('numberOfTasksByFilterName', [function ($filter) {
            return function (inputArray, filter) {
                var count = 0;
                    //taskTitle = filterName.Params.Name, dueStatus = filterName.Params.DueStatus, responsibleUserName = filterName.Params.AssignedTo;
                if (filter.FilterName === 'No Filter') {
                    angular.forEach(inputArray, function (item) {
                        count += 1;
                    });
                } else if (filter.FilterName === 'Unassigned') {
                    angular.forEach(inputArray, function (item) {
//                        if(item.ResponsibleUser !== ((angular.isUndefined(filter.ResponsibleUserId)) || filter.ResponsibleUserId === null ))
                        count += 1;
                    });
                } else {
                    angular.forEach(inputArray, function (item) {
//                         if(item.DueStatus.Status !== ((angular.isUndefined(filter.DueStatusId)) || filter.DueStatusId === null ))
                        count += 1;
                    });
                }
                return count;
            };
        }])
        .filter('findFilterByName', [function ($filter) {
            return function (inputArray, filterName) {
                var data = 'No Filter';
                angular.forEach(inputArray, function (item) {
                    if (item.FilterName === filterName) {
                        data = item;
                    }
                });
                return data;
            };
        }])
        .filter('findFilterById', [function ($filter) {
            return function (inputArray, filterId) {
                var data = 1;
                angular.forEach(inputArray, function (item) {
                    if (item.FilterId == filterId) {
                        data = item;
                    }
                });
                return data;
            };
        }])
        .filter('cut', function () {
            return function (value, wordwise, max, tail) {
                if (!value) {
                    return '';
                }

                max = parseInt(max, 10);
                if (!max) {
                    return value;
                }
                if (value.length <= max) {
                    return value;
                }

                value = value.substr(0, max);
                if (wordwise) {
                    var lastspace = value.lastIndexOf(' ');
                    if (lastspace !== -1) {
                  //Also remove . and , so its gives a cleaner result.
                        if (value.charAt(lastspace - 1) === '.' || value.charAt(lastspace - 1) === ',') {
                            lastspace = lastspace - 1;
                        }
                        value = value.substr(0, lastspace);
                    }
                }

                return value + (tail || ' …');
            };
        })
        .service('authenticationService', ['$http', 'Config',function ($http, Config) {
  
            function NoAuthenticationException(message) {
                this.name = 'AuthenticationRequired';
                this.message = message;
            }

//            function NextStateUndefinedException(message) {
//                this.name = 'NextStateUndefined';
//                this.message = message;
//            }

            function AuthenticationExpiredException(message) {
                this.name = 'AuthenticationExpired';
                this.message = message;
            }

            function AuthenticationRetrievalException(message) {
                this.name = 'AuthenticationRetrieval';
                this.message = message;
            }

            var userData = {
                isAuthenticated: false,
                username: '',
                bearerToken: '',
                expirationDate: null,
                userRole: 'admin'
            };

//            var nextState = {
//                name: '',
//                error: ''
//            };

            function isAuthenticationExpired(expirationDate) {
                var now = new Date();
                expirationDate = new Date(expirationDate);
                if (expirationDate - now > 0) {
                    return false;
                }
                return true;
            }
            
            function removeData() {
                //$cookies.remove('auth_data');
            }

            function saveData() {
                removeData();
            //    $cookies.put('auth_data', userData);
            }
            
            function setHttpAuthHeader() {
                $http.defaults.headers.common.Authorization = 'Bearer ' + userData.bearerToken;
            }
            function retrieveSavedData() {
                var savedData = "";     //$cookie.get('auth_data');
                if (savedData === 'undefined') {
                    throw new AuthenticationRetrievalException('No authentication data exists');
                } else if (isAuthenticationExpired(savedData.expirationDate)) {
                    throw new AuthenticationExpiredException('Authentication token has already expired');
                } else {
                    userData = savedData;
                    setHttpAuthHeader();
                }
            }       
            isAuthorized = function (authorizedRoles) {
                if (!angular.isArray(authorizedRoles)) {
                  authorizedRoles = [authorizedRoles];
                }
                
                return true;
              };
            isAuthenticated = function () {
                if (userData.isAuthenticated && !isAuthenticationExpired(userData.expirationDate)) {
                    return true;
                }
                try {
                    retrieveSavedData();
                } catch (e) {
                    throw new NoAuthenticationException('Authentication not found');
                }
                return true;            
            };
 
            function clearUserData() {
                userData.isAuthenticated = false;
                userData.username = '';
                userData.bearerToken = '';
                userData.expirationDate = null;
                userData.userRole = '';
            }

//            getNextState = function () {
//                if (nextState.name === '') {
//                    throw new NextStateUndefinedException('No state data was set');
//                }
//                return nextState;
//            };
//
//            setNextState = function (name, error) {
//                nextState.name = name;
//                nextState.error = error;
//            };
//
//            clearNextState = function () {
//                nextState.name = '';
//                nextState.error = '';
//            };
            
            
            return {
                getUserData: function () {
                    return userData;
                },
                authenticate: function (username, password, successCallback, errorCallback, persistData) {
                    var data = $.param({
                        'grant_type' : 'password',
                        'username': username,
                        'password': password
                    });
                    var config = {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    };         
  
                // http://localhost:50443
                $http.post(Config.authURL, data, config)
                    .then(function(data) {
                        if (data != null) {
                            userReturnData = data.data;              
                            userData.isAuthenticated = true;
                            userData.username = username; //userReturnData.userName;
                            userData.bearerToken = userReturnData.access_token;
                            userData.expirationDate = new Date(userReturnData['.expires']);
                           if(username === 'Rob')
                                userData.userRole = 'QlikDashboardUser';
                            else if (username === 'Ed')
                                userData.userRole = 'OldTroutUser';
                            else
                                userData.userRole = 'admin';
                            if (persistData === true) {
                                saveData();
                            }
                            if (typeof successCallback === 'function') {
                                successCallback();
                            }
                        }
                        else {
                            errorCallback('Unable to contact server; please, try again later.');
                        }
                    })
                    .catch(function(data) {
                        if (typeof errorCallback === 'function') {
                            var errorDescription = 'Unable to contact server; please, try again later.';
                            if (data == null) {
                                errorDescription = $.param({'error_description' : 'Unable to contact server; please, try again later.' });        
                            } else {
                                if (data.data.error_description) {
                                    errorDescription = data.data.error_description;
                                }
                            }
                            errorCallback(errorDescription);
                        }
                    });
                },
                removeAuthentication : function () {
                    removeData();
                    clearUserData();
                   // $http.defaults.headers.common.Authorization = null;
                }
            };
        }]);
})();

// Other libraries are loaded dynamically in the config.js file using the library ocLazyLoad