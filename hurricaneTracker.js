import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Users, Phone, Radio, Clock, CheckCircle, XCircle, Plus, Search, Filter } from 'lucide-react';

const EmergencyResponseHub = () => {
  const [activeTab, setActiveTab] = useState('alerts');
  const [selectedCounty, setSelectedCounty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample data - in a real app, this would come from a database
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'evacuation',
      title: 'Mandatory Evacuation - Buncombe County',
      description: 'Immediate evacuation required for areas near Swannanoa River due to dam failure risk.',
      county: 'Buncombe',
      priority: 'critical',
      timestamp: '2024-09-27 14:30',
      status: 'active'
    },
    {
      id: 2,
      type: 'road',
      title: 'I-40 Closed - Multiple Locations',
      description: 'Interstate 40 closed between Asheville and Morganton due to bridge washouts.',
      county: 'Multiple',
      priority: 'high',
      timestamp: '2024-09-27 12:15',
      status: 'active'
    },
    {
      id: 3,
      type: 'shelter',
      title: 'Emergency Shelter Available',
      description: 'Red Cross shelter open at Asheville High School - 1000 beds available.',
      county: 'Buncombe',
      priority: 'medium',
      timestamp: '2024-09-27 10:00',
      status: 'active'
    }
  ]);

  const [persons, setPersons] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      age: 34,
      description: 'Last seen in Chimney Rock area, driving blue Honda Civic',
      county: 'Rutherford',
      contactInfo: 'Contact: Mike Johnson 828-555-0123',
      reportedTimestamp: '2024-09-27 16:45',
      foundTimestamp: null,
      foundLocation: null,
      status: 'missing'
    },
    {
      id: 2,
      name: 'Robert Chen',
      age: 67,
      description: 'Missing from Black Mountain nursing home during evacuation',
      county: 'Buncombe',
      contactInfo: 'Contact: Mountain View Care 828-555-0456',
      reportedTimestamp: '2024-09-27 15:20',
      foundTimestamp: null,
      foundLocation: null,
      status: 'missing'
    },
    {
      id: 3,
      name: 'Maria Rodriguez',
      age: 28,
      description: 'Was missing from Hendersonville area during evacuation',
      county: 'Henderson',
      contactInfo: 'Contact shelter at 828-555-0789',
      reportedTimestamp: '2024-09-27 14:30',
      foundTimestamp: '2024-09-27 17:30',
      foundLocation: 'Found safe at Hendersonville shelter',
      status: 'found'
    }
  ]);

  const [emergencyRequests, setEmergencyRequests] = useState([
    {
      id: 1,
      type: 'medical',
      description: 'Elderly man needs insulin, stranded on Riverside Drive',
      location: 'Riverside Drive, Asheville',
      county: 'Buncombe',
      priority: 'critical',
      timestamp: '2024-09-27 18:00',
      status: 'pending',
      contactInfo: '828-555-0321'
    },
    {
      id: 2,
      type: 'rescue',
      description: 'Family of 4 trapped on roof, house surrounded by water',
      location: 'Mill Creek Road, Old Fort',
      county: 'McDowell',
      priority: 'critical',
      timestamp: '2024-09-27 17:45',
      status: 'in-progress',
      contactInfo: '828-555-0654'
    },
    {
      id: 3,
      type: 'supplies',
      description: 'Need clean water and food for 12 people',
      location: 'Community Center, Burnsville',
      county: 'Yancey',
      priority: 'medium',
      timestamp: '2024-09-27 16:30',
      status: 'resolved',
      contactInfo: '828-555-0987'
    }
  ]);

  // Form states
  const [showMissingPersonForm, setShowMissingPersonForm] = useState(false);
  const [showMarkFoundForm, setShowMarkFoundForm] = useState(false);
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState(null);

  const counties = ['all', 'Alamance', 'Alexander', 'Alleghany', 'Anson', 'Ashe', 'Avery', 'Beaufort', 'Bertie', 'Bladen', 'Brunswick', 'Buncombe', 'Burke', 'Cabarrus', 'Caldwell', 'Camden', 'Carteret', 'Caswell', 'Catawba', 'Chatham', 'Cherokee', 'Chowan', 'Clay', 'Cleveland', 'Columbus', 'Craven', 'Cumberland', 'Currituck', 'Dare', 'Davidson', 'Davie', 'Duplin', 'Durham', 'Edgecombe', 'Forsyth', 'Franklin', 'Gaston', 'Gates', 'Graham', 'Granville', 'Greene', 'Guilford', 'Halifax', 'Harnett', 'Haywood', 'Henderson', 'Hertford', 'Hoke', 'Hyde', 'Iredell', 'Jackson', 'Johnston', 'Jones', 'Lee', 'Lenoir', 'Lincoln', 'Macon', 'Madison', 'Martin', 'McDowell', 'Mecklenburg', 'Mitchell', 'Montgomery', 'Moore', 'Nash', 'New Hanover', 'Northampton', 'Onslow', 'Orange', 'Pamlico', 'Pasquotank', 'Pender', 'Perquimans', 'Person', 'Pitt', 'Polk', 'Randolph', 'Richmond', 'Robeson', 'Rockingham', 'Rowan', 'Rutherford', 'Sampson', 'Scotland', 'Stanly', 'Stokes', 'Surry', 'Swain', 'Transylvania', 'Tyrrell', 'Union', 'Vance', 'Wake', 'Warren', 'Washington', 'Watauga', 'Wayne', 'Wilkes', 'Wilson', 'Yadkin', 'Yancey'];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'missing': return 'bg-orange-100 text-orange-800';
      case 'found': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filterData = (data) => {
    return data.filter(item => {
      const matchesCounty = selectedCounty === 'all' || item.county === selectedCounty;
      const matchesSearch = searchTerm === '' || 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCounty && matchesSearch;
    });
  };

  const MissingPersonForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Report Missing Person</h3>
        <div className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full p-2 border rounded" />
          <input type="number" placeholder="Age" className="w-full p-2 border rounded" />
          <textarea placeholder="Description (last seen, clothing, etc.)" className="w-full p-2 border rounded h-24" />
          <select className="w-full p-2 border rounded">
            <option value="">Select County</option>
            {counties.slice(1).map(county => (
              <option key={county} value={county}>{county}</option>
            ))}
          </select>
          <input type="text" placeholder="Contact Information" className="w-full p-2 border rounded" />
          <div className="flex gap-2">
            <button 
              onClick={() => setShowMissingPersonForm(false)}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button 
              onClick={() => setShowMissingPersonForm(false)}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Submit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const MarkFoundForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Mark Person as Found</h3>
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-600">Marking as found:</p>
            <p className="font-medium">{persons.find(p => p.id === selectedPersonId)?.name}</p>
          </div>
          <textarea placeholder="Where were they found? Current condition?" className="w-full p-2 border rounded h-24" />
          <input type="text" placeholder="Contact Information (optional)" className="w-full p-2 border rounded" />
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setShowMarkFoundForm(false);
                setSelectedPersonId(null);
              }}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                setShowMarkFoundForm(false);
                setSelectedPersonId(null);
              }}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Mark as Found
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const EmergencyRequestForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Request Emergency Help</h3>
        <div className="space-y-4">
          <select className="w-full p-2 border rounded">
            <option value="">Type of Emergency</option>
            <option value="medical">Medical Emergency</option>
            <option value="rescue">Rescue Needed</option>
            <option value="supplies">Supplies Needed</option>
            <option value="other">Other</option>
          </select>
          <textarea placeholder="Detailed description of emergency" className="w-full p-2 border rounded h-24" />
          <input type="text" placeholder="Exact location/address" className="w-full p-2 border rounded" />
          <select className="w-full p-2 border rounded">
            <option value="">Select County</option>
            {counties.slice(1).map(county => (
              <option key={county} value={county}>{county}</option>
            ))}
          </select>
          <select className="w-full p-2 border rounded">
            <option value="">Priority Level</option>
            <option value="critical">Critical - Life Threatening</option>
            <option value="high">High - Urgent</option>
            <option value="medium">Medium - Important</option>
          </select>
          <input type="text" placeholder="Contact Information" className="w-full p-2 border rounded" />
          <div className="flex gap-2">
            <button 
              onClick={() => setShowEmergencyForm(false)}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button 
              onClick={() => setShowEmergencyForm(false)}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-600 text-white p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="w-8 h-8" />
            NC Emergency Response Hub
          </h1>
          <p className="text-red-100 mt-1">North Carolina Statewide Emergency Coordination</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select 
              value={selectedCounty} 
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            >
              {counties.map(county => (
                <option key={county} value={county}>
                  {county === 'all' ? 'All Counties' : county + ' County'}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-3 py-1 text-sm flex-1"
            />
          </div>
          <div className="text-sm text-gray-600">
            <Clock className="w-4 h-4 inline mr-1" />
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex overflow-x-auto">
            <button 
              onClick={() => setActiveTab('alerts')}
              className={`px-6 py-3 font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'alerts' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              Emergency Alerts
            </button>
            <button 
              onClick={() => setActiveTab('persons')}
              className={`px-6 py-3 font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'persons' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Missing/Found Persons
            </button>
            <button 
              onClick={() => setActiveTab('help')}
              className={`px-6 py-3 font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'help' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Phone className="w-4 h-4 inline mr-2" />
              Help Requests
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4">
        {/* Emergency Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Emergency Alerts & Updates</h2>
              <span className="text-sm text-gray-600">{filterData(alerts).length} active alerts</span>
            </div>
            
            {filterData(alerts).map(alert => (
              <div key={alert.id} className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                        {alert.priority.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">{alert.county} County</span>
                      <span className="text-sm text-gray-500">{alert.timestamp}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{alert.title}</h3>
                    <p className="text-gray-700">{alert.description}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(alert.status)}`}>
                    {alert.status.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Missing/Found Persons Tab */}
        {activeTab === 'persons' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Missing & Found Persons</h2>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-orange-600">{filterData(persons).filter(p => p.status === 'missing').length}</span> missing
                  <span className="mx-2">•</span>
                  <span className="font-medium text-green-600">{filterData(persons).filter(p => p.status === 'found').length}</span> found
                </div>
                <button 
                  onClick={() => setShowMissingPersonForm(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Report Missing
                </button>
              </div>
            </div>
            
            {filterData(persons).map(person => (
              <div key={person.id} className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(person.status)}`}>
                        {person.status === 'missing' ? 'MISSING' : 'FOUND SAFE'}
                      </span>
                      <span className="text-sm text-gray-500">{person.county} County</span>
                      <span className="text-sm text-gray-500">Reported: {person.reportedTimestamp}</span>
                      {person.foundTimestamp && (
                        <span className="text-sm text-green-600">Found: {person.foundTimestamp}</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{person.name}, Age {person.age}</h3>
                    <p className="text-gray-700 mb-2">{person.description}</p>
                    {person.foundLocation && (
                      <p className="text-green-700 mb-2 font-medium">✓ {person.foundLocation}</p>
                    )}
                    <p className="text-sm text-blue-600">{person.contactInfo}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {person.status === 'missing' && (
                      <button 
                        onClick={() => {
                          setSelectedPersonId(person.id);
                          setShowMarkFoundForm(true);
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Mark Found
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Requests Tab */}
        {activeTab === 'help' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Emergency Help Requests</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{filterData(emergencyRequests).length} requests</span>
                <button 
                  onClick={() => setShowEmergencyForm(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Request Help
                </button>
              </div>
            </div>
            
            {filterData(emergencyRequests).map(request => (
              <div key={request.id} className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(request.priority)}`}>
                        {request.priority.toUpperCase()}
                      </span>
                      <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {request.type.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">{request.county} County</span>
                      <span className="text-sm text-gray-500">{request.timestamp}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      {request.location}
                    </h3>
                    <p className="text-gray-700 mb-2">{request.description}</p>
                    <p className="text-sm text-blue-600">{request.contactInfo}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Emergency Contact Info */}
      <div className="bg-gray-800 text-white p-4 mt-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Radio className="w-4 h-4" />
            Emergency Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium">911 Emergency Services</p>
              <p className="text-gray-300">Call 911 for immediate life-threatening emergencies</p>
            </div>
            <div>
              <p className="font-medium">Non-Emergency Line</p>
              <p className="text-gray-300">828-250-6670 (Buncombe County)</p>
            </div>
            <div>
              <p className="font-medium">Ham Radio Emergency Net</p>
              <p className="text-gray-300">146.820 MHz (Primary), 147.240 MHz (Backup)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Forms */}
      {showMissingPersonForm && <MissingPersonForm />}
      {showMarkFoundForm && <MarkFoundForm />}
      {showEmergencyForm && <EmergencyRequestForm />}
    </div>
  );
};

export default EmergencyResponseHub;