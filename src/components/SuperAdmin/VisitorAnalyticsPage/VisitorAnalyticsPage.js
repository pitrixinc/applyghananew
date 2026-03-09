import { useState, useEffect, useMemo, useCallback } from 'react';
import { collection, query, orderBy, onSnapshot, where, getDocs, Timestamp, limit, startAfter } from 'firebase/firestore';
import { db } from '@/firebase.config';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUsers, 
  FiGlobe, 
  FiClock, 
  FiEye, 
  FiRefreshCw, 
  FiFilter, 
  FiSearch, 
  FiChevronDown,
  FiCalendar,
  FiPieChart,
  FiBarChart2,
  FiMap,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiTrendingUp,
  FiTrendingDown,
  FiAward,
  FiFlag
} from 'react-icons/fi';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const VisitorsAnalyticsPage = () => {
  const [allVisitors, setAllVisitors] = useState([]); // All visitors for analytics
  const [paginatedVisitors, setPaginatedVisitors] = useState([]); // Visitors for table display
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    country: '',
    city: '',
    deviceType: '',
    pageUrl: '',
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'timestamp',
    direction: 'descending',
  });
  const [dateFilter, setDateFilter] = useState({
    type: 'all', // 'today', 'week', 'month', 'all', 'single', 'range'
    singleDate: null,
    startDate: null,
    endDate: null,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [pageStats, setPageStats] = useState({});
  const [peakHours, setPeakHours] = useState([]);

  // Calculate date range based on filter type
  const getDateRange = useCallback(() => {
    const now = new Date();
    let start = null;
    let end = null;

    switch (dateFilter.type) {
      case 'today':
        start = new Date(now);
        start.setHours(0, 0, 0, 0);
        end = new Date(now);
        end.setHours(23, 59, 59, 999);
        break;
      case 'week':
        start = new Date(now);
        start.setDate(now.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        end = new Date(now);
        end.setHours(23, 59, 59, 999);
        break;
      case 'month':
        start = new Date(now);
        start.setMonth(now.getMonth() - 1);
        start.setHours(0, 0, 0, 0);
        end = new Date(now);
        end.setHours(23, 59, 59, 999);
        break;
      case 'single':
        if (dateFilter.singleDate) {
          start = new Date(dateFilter.singleDate);
          start.setHours(0, 0, 0, 0);
          end = new Date(dateFilter.singleDate);
          end.setHours(23, 59, 59, 999);
        }
        break;
      case 'range':
        if (dateFilter.startDate && dateFilter.endDate) {
          start = new Date(dateFilter.startDate);
          start.setHours(0, 0, 0, 0);
          end = new Date(dateFilter.endDate);
          end.setHours(23, 59, 59, 999);
        }
        break;
      case 'all':
      default:
        start = null;
        end = null;
        break;
    }

    return { start, end };
  }, [dateFilter]);

  // Fetch all visitors data for analytics
  const fetchAllVisitors = useCallback(async () => {
    try {
      const { start, end } = getDateRange();
      let q = query(collection(db, 'visits'), orderBy('timestamp', 'desc'));
      
      if (start && end) {
        q = query(
          collection(db, 'visits'),
          where('timestamp', '>=', Timestamp.fromDate(start)),
          where('timestamp', '<=', Timestamp.fromDate(end)),
          orderBy('timestamp', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(q);
      const visitorsData = [];
      const countriesSet = new Set();
      const citiesSet = new Set();
      const pagesSet = new Set();
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        visitorsData.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date(),
        });
        
        // Collect unique values for filters
        if (data.location?.country) countriesSet.add(data.location.country);
        if (data.location?.city) citiesSet.add(data.location.city);
        if (data.pageUrl) pagesSet.add(data.pageUrl);
      });
      
      setAllVisitors(visitorsData);
      setCountries(Array.from(countriesSet));
      setCities(Array.from(citiesSet));
      setPages(Array.from(pagesSet));
    } catch (error) {
      console.error('Error fetching visitors:', error);
    }
  }, [getDateRange]);

  // Fetch paginated visitors for table display
  const fetchPaginatedVisitors = useCallback(async (isInitial = true) => {
    setLoading(true);
    try {
      const { start, end } = getDateRange();
      let q = query(collection(db, 'visits'), orderBy('timestamp', 'desc'), limit(pageSize));
      
      if (start && end) {
        q = query(
          collection(db, 'visits'),
          where('timestamp', '>=', Timestamp.fromDate(start)),
          where('timestamp', '<=', Timestamp.fromDate(end)),
          orderBy('timestamp', 'desc'),
          limit(pageSize)
        );
      }
      
      // Handle pagination
      if (!isInitial && lastVisible) {
        q = query(
          collection(db, 'visits'),
          orderBy('timestamp', 'desc'),
          startAfter(lastVisible),
          limit(pageSize)
        );
        
        if (start && end) {
          q = query(
            collection(db, 'visits'),
            where('timestamp', '>=', Timestamp.fromDate(start)),
            where('timestamp', '<=', Timestamp.fromDate(end)),
            orderBy('timestamp', 'desc'),
            startAfter(lastVisible),
            limit(pageSize)
          );
        }
      }
      
      const querySnapshot = await getDocs(q);
      const visitorsData = [];
      
      if (!querySnapshot.empty) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(querySnapshot.docs.length === pageSize);
      } else {
        setHasMore(false);
      }
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        visitorsData.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date(),
        });
      });
      
      if (isInitial) {
        setPaginatedVisitors(visitorsData);
      } else {
        setPaginatedVisitors(prev => [...prev, ...visitorsData]);
      }
    } catch (error) {
      console.error('Error fetching paginated visitors:', error);
    } finally {
      setLoading(false);
    }
  }, [getDateRange, lastVisible, pageSize]);

  // Initial data fetch
  useEffect(() => {
    fetchAllVisitors();
    fetchPaginatedVisitors(true);
  }, [fetchAllVisitors, fetchPaginatedVisitors]);

  // Filter cities based on selected country
  useEffect(() => {
    if (filters.country) {
      const filtered = allVisitors
        .filter(v => v.location?.country === filters.country)
        .map(v => v.location?.city)
        .filter(city => city);
      setFilteredCities([...new Set(filtered)]);
    } else {
      setFilteredCities(cities);
    }
  }, [filters.country, allVisitors, cities]);

  // Filter and sort visitors for analytics
  const filteredVisitors = useMemo(() => {
    let result = [...allVisitors];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(visitor => 
        visitor.ipAddress?.toLowerCase().includes(query) ||
        visitor.location?.city?.toLowerCase().includes(query) ||
        visitor.location?.country?.toLowerCase().includes(query) ||
        visitor.pageUrl?.toLowerCase().includes(query) ||
        visitor.userAgent?.toLowerCase().includes(query)
      );
    }
    
    // Apply filters
    if (filters.country) {
      result = result.filter(visitor => 
        visitor.location?.country === filters.country
      );
    }
    
    if (filters.city) {
      result = result.filter(visitor => 
        visitor.location?.city === filters.city
      );
    }
    
    if (filters.deviceType) {
      result = result.filter(visitor => {
        const ua = visitor.userAgent?.toLowerCase() || '';
        if (filters.deviceType === 'desktop') {
          return !ua.match(/mobile|android|iphone|ipad|ipod/);
        } else if (filters.deviceType === 'mobile') {
          return ua.match(/mobile|android|iphone|ipad|ipod/);
        }
        return true;
      });
    }
    
    if (filters.pageUrl) {
      result = result.filter(visitor => 
        visitor.pageUrl === filters.pageUrl
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [allVisitors, searchQuery, filters, sortConfig]);

  // Filter and sort paginated visitors for table display
  const filteredPaginatedVisitors = useMemo(() => {
    let result = [...paginatedVisitors];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(visitor => 
        visitor.ipAddress?.toLowerCase().includes(query) ||
        visitor.location?.city?.toLowerCase().includes(query) ||
        visitor.location?.country?.toLowerCase().includes(query) ||
        visitor.pageUrl?.toLowerCase().includes(query) ||
        visitor.userAgent?.toLowerCase().includes(query)
      );
    }
    
    // Apply filters
    if (filters.country) {
      result = result.filter(visitor => 
        visitor.location?.country === filters.country
      );
    }
    
    if (filters.city) {
      result = result.filter(visitor => 
        visitor.location?.city === filters.city
      );
    }
    
    if (filters.deviceType) {
      result = result.filter(visitor => {
        const ua = visitor.userAgent?.toLowerCase() || '';
        if (filters.deviceType === 'desktop') {
          return !ua.match(/mobile|android|iphone|ipad|ipod/);
        } else if (filters.deviceType === 'mobile') {
          return ua.match(/mobile|android|iphone|ipad|ipod/);
        }
        return true;
      });
    }
    
    if (filters.pageUrl) {
      result = result.filter(visitor => 
        visitor.pageUrl === filters.pageUrl
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [paginatedVisitors, searchQuery, filters, sortConfig]);

  // Calculate page statistics based on ALL filtered data
  useEffect(() => {
    if (filteredVisitors.length === 0) {
      setPageStats({});
      return;
    }
    
    const pageCounts = {};
    filteredVisitors.forEach(visitor => {
      const page = visitor.pageUrl || 'Unknown';
      pageCounts[page] = (pageCounts[page] || 0) + 1;
    });
    
    // Find most and least viewed pages
    const pageEntries = Object.entries(pageCounts);
    if (pageEntries.length > 0) {
      pageEntries.sort((a, b) => b[1] - a[1]);
      setPageStats({
        counts: pageCounts,
        mostViewed: pageEntries[0],
        leastViewed: pageEntries[pageEntries.length - 1]
      });
    }
  }, [filteredVisitors]);

  // Calculate peak hours based on ALL filtered data
  useEffect(() => {
    if (filteredVisitors.length === 0) {
      setPeakHours([]);
      return;
    }
    
    const hourlyCounts = Array(24).fill(0);
    filteredVisitors.forEach(visitor => {
      const hour = visitor.timestamp.getHours();
      hourlyCounts[hour] += 1;
    });
    
    // Find peak hours (top 3)
    const hoursWithCounts = hourlyCounts.map((count, hour) => ({ hour, count }));
    hoursWithCounts.sort((a, b) => b.count - a.count);
    setPeakHours(hoursWithCounts.slice(0, 3));
  }, [filteredVisitors]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Handle date filter change
  const handleDateFilterChange = (type) => {
    setDateFilter(prev => ({
      ...prev,
      type,
      singleDate: type === 'single' ? prev.singleDate : null,
      startDate: type === 'range' ? prev.startDate : null,
      endDate: type === 'range' ? prev.endDate : null,
    }));
    setCurrentPage(1);
    setLastVisible(null);
  };

  // Handle single date selection
  const handleSingleDateSelect = (date) => {
    setDateFilter(prev => ({
      ...prev,
      type: 'single',
      singleDate: date,
      startDate: null,
      endDate: null,
    }));
    setCurrentPage(1);
    setLastVisible(null);
  };

  // Handle custom date range
  const handleCustomDateRange = (startDate, endDate) => {
    setDateFilter(prev => ({
      ...prev,
      type: 'range',
      startDate,
      endDate,
      singleDate: null,
    }));
    setCurrentPage(1);
    setLastVisible(null);
  };

  // Calculate statistics based on ALL filtered data
  const stats = useMemo(() => {
    const totalVisitors = filteredVisitors.length;
    const uniqueVisitors = new Set(filteredVisitors.map(v => v.ipAddress)).size;
    
    // Calculate countries data
    const countriesData = {};
    filteredVisitors.forEach(visitor => {
      const country = visitor.location?.country || 'Unknown';
      countriesData[country] = (countriesData[country] || 0) + 1;
    });
    
    // Calculate device types
    const deviceData = { desktop: 0, mobile: 0 };
    filteredVisitors.forEach(visitor => {
      const ua = visitor.userAgent?.toLowerCase() || '';
      if (ua.match(/mobile|android|iphone|ipad|ipod/)) {
        deviceData.mobile += 1;
      } else {
        deviceData.desktop += 1;
      }
    });
    
    // Calculate pages data
    const pagesData = {};
    filteredVisitors.forEach(visitor => {
      const page = visitor.pageUrl || 'Unknown';
      pagesData[page] = (pagesData[page] || 0) + 1;
    });
    
    // Calculate hourly distribution
    const hourlyData = Array(24).fill(0);
    filteredVisitors.forEach(visitor => {
      const hour = visitor.timestamp.getHours();
      hourlyData[hour] += 1;
    });
    
    return {
      totalVisitors,
      uniqueVisitors,
      countriesData,
      deviceData,
      pagesData,
      hourlyData,
    };
  }, [filteredVisitors]);

  // Prepare chart data
  const countriesChartData = {
    labels: Object.keys(stats.countriesData),
    datasets: [
      {
        data: Object.values(stats.countriesData),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
          '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
          '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ],
      },
    ],
  };

  const deviceChartData = {
    labels: ['Desktop', 'Mobile'],
    datasets: [
      {
        data: [stats.deviceData.desktop, stats.deviceData.mobile],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const hourlyChartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Visits by Hour',
        data: stats.hourlyData,
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      country: '',
      city: '',
      deviceType: '',
      pageUrl: '',
    });
    setSearchQuery('');
    setDateFilter({
      type: 'all',
      singleDate: null,
      startDate: null,
      endDate: null,
    });
    setCurrentPage(1);
    setLastVisible(null);
  };

  // Format date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Get device icon based on user agent
  const getDeviceIcon = (userAgent) => {
    const ua = userAgent?.toLowerCase() || '';
    if (ua.match(/mobile|android|iphone/)) {
      return '📱';
    } else if (ua.match(/tablet|ipad/)) {
      return '📱';
    }
    return '💻';
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (newPage > currentPage && hasMore) {
      fetchPaginatedVisitors(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredVisitors.length / pageSize);

  // Get active date filter button style
  const getDateFilterButtonStyle = (type) => {
    return dateFilter.type === type 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">System Analytics</h1>
          <p className="text-gray-600 mt-2">Track and analyze your website visitors in real-time</p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search visitors by IP, location, page, etc."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FiFilter className="mr-2" />
                Filters
                <FiChevronDown className={`ml-2 transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FiRefreshCw className="mr-2" />
                Reset
              </button>
            </div>
          </div>
          
          {/* Advanced Filters */}
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.country}
                  onChange={(e) => setFilters({...filters, country: e.target.value, city: ''})}
                >
                  <option value="">All Countries</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.city}
                  onChange={(e) => setFilters({...filters, city: e.target.value})}
                  disabled={!filters.country && filteredCities.length === 0}
                >
                  <option value="">All Cities</option>
                  {filteredCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device Type</label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.deviceType}
                  onChange={(e) => setFilters({...filters, deviceType: e.target.value})}
                >
                  <option value="">All Devices</option>
                  <option value="desktop">Desktop</option>
                  <option value='mobile'>Mobile</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page URL</label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.pageUrl}
                  onChange={(e) => setFilters({...filters, pageUrl: e.target.value})}
                >
                  <option value="">All Pages</option>
                  {pages.map(page => (
                    <option key={page} value={page}>{page.length > 30 ? `${page.substring(0, 30)}...` : page}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
          
          {/* Date Range Selector */}
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleDateFilterChange('today')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${getDateFilterButtonStyle('today')}`}
              >
                Today
              </button>
              <button
                onClick={() => handleDateFilterChange('week')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${getDateFilterButtonStyle('week')}`}
              >
                Last 7 days
              </button>
              <button
                onClick={() => handleDateFilterChange('month')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${getDateFilterButtonStyle('month')}`}
              >
                Last 30 days
              </button>
              <button
                onClick={() => handleDateFilterChange('all')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${getDateFilterButtonStyle('all')}`}
              >
                All time
              </button>
            </div>
            
            {/* Single Date Selection */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Single Date:</span>
              </div>
              
              <div className="flex gap-2">
                <DatePicker
                  selected={dateFilter.singleDate}
                  onChange={handleSingleDateSelect}
                  placeholderText="Select a date"
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
            
            {/* Custom Date Range */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Custom Range:</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <DatePicker
                  selected={dateFilter.startDate}
                  onChange={(date) => handleCustomDateRange(date, dateFilter.endDate)}
                  selectsStart
                  startDate={dateFilter.startDate}
                  endDate={dateFilter.endDate}
                  placeholderText="Start Date"
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                />
                <span className="hidden sm:inline self-center">to</span>
                <DatePicker
                  selected={dateFilter.endDate}
                  onChange={(date) => handleCustomDateRange(dateFilter.startDate, date)}
                  selectsEnd
                  startDate={dateFilter.startDate}
                  endDate={dateFilter.endDate}
                  minDate={dateFilter.startDate}
                  placeholderText="End Date"
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Page Statistics */}
        {Object.keys(pageStats).length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
          >
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Total Page Views</h3>
                  <p className="text-2xl font-bold mt-2">{stats.totalVisitors}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FiEye className="w-6 h-6" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Most Viewed Page</h3>
                  <p className="text-[10px] mt-2 truncate" title={pageStats.mostViewed?.[0]}>
                    {pageStats.mostViewed?.[0]?.length > 50 
                      ? `${pageStats.mostViewed[0].substring(0, 50)}...` 
                      : pageStats.mostViewed?.[0]}
                  </p>
                  <p className="text-2xl font-bold mt-1">{pageStats.mostViewed?.[1]}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <FiTrendingUp className="w-6 h-6" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Least Viewed Page</h3>
                  <p className="text-[10px] mt-2 truncate" title={pageStats.leastViewed?.[0]}>
                    {pageStats.leastViewed?.[0]?.length > 50 
                      ? `${pageStats.leastViewed[0].substring(0, 50)}...` 
                      : pageStats.leastViewed?.[0]}
                  </p>
                  <p className="text-2xl font-bold mt-1">{pageStats.leastViewed?.[1]}</p>
                </div>
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <FiTrendingDown className="w-6 h-6" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Peak Hours */}
        {peakHours.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="bg-white rounded-lg shadow p-6 mb-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Peak Visit Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {peakHours.map((hourData, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                      <FiClock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">{`${hourData.hour}:00 - ${hourData.hour + 1}:00`}</p>
                      <p className="text-sm text-gray-600">{hourData.count} visits</p>
                    </div>
                  </div>
                  {index === 0 && (
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      <FiAward className="inline mr-1" /> Peak
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stats Overview */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
        >
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FiUsers className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">{stats.totalVisitors}</h2>
                <p className="text-sm text-gray-600">Total Visitors</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FiGlobe className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">{stats.uniqueVisitors}</h2>
                <p className="text-sm text-gray-600">Unique Visitors</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FiClock className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">{Object.keys(stats.countriesData).length}</h2>
                <p className="text-sm text-gray-600">Countries</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FiEye className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">{Object.keys(stats.pagesData).length}</h2>
                <p className="text-sm text-gray-600">Pages Viewed</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
        >
          {/* Countries Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Visitors by Country</h3>
              <FiMap className="text-gray-400" />
            </div>
            <div className="h-64 overflow-x-auto">
              <Pie 
                data={countriesChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                  },
                }}
              />
            </div>
          </div>
          
          {/* Device Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Device Distribution</h3>
              <FiPieChart className="text-gray-400" />
            </div>
            <div className="h-64">
              <Pie 
                data={deviceChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                  },
                }}
              />
            </div>
          </div>
          
          {/* Hourly Chart */}
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Visits by Hour of Day</h3>
              <FiBarChart2 className="text-gray-400" />
            </div>
            <div className="h-64">
              <Bar 
                data={hourlyChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Visitors Table */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-lg shadow overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Visitor Details</h3>
            <span className="text-sm text-gray-600">
              {filteredVisitors.length} {filteredVisitors.length === 1 ? 'record' : 'records'} found
            </span>
          </div>
          
          { filteredVisitors.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">No visitor data found with the current filters.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('timestamp')}
                      >
                        <div className="flex items-center">
                          Date & Time
                          {sortConfig.key === 'timestamp' && (
                            <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('ipAddress')}
                      >
                        <div className="flex items-center">
                          IP Address
                          {sortConfig.key === 'ipAddress' && (
                            <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Device
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('pageUrl')}
                      >
                        <div className="flex items-center">
                          Page
                          {sortConfig.key === 'pageUrl' && (
                            <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Session
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPaginatedVisitors.map((visitor) => (
                      <motion.tr 
                        key={visitor.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(visitor.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {visitor.ipAddress}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {visitor.location ? (
                            <div className="flex items-center">
                              {visitor.location.countryCode && (
                                <img 
                                  src={visitor.location.flagUrl} 
                                  alt={visitor.location.country} 
                                  className="h-4 w-6 mr-2"
                                />
                              )}
                              <span>
                                {visitor.location.city && `${visitor.location.city}, `}
                                {visitor.location.country}
                              </span>
                            </div>
                          ) : (
                            'Unknown'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="mr-2">{getDeviceIcon(visitor.userAgent)}</span>
                            <span>
                              {visitor.userAgent ? (
                                visitor.userAgent.length > 30 
                                  ? `${visitor.userAgent.substring(0, 30)}...` 
                                  : visitor.userAgent
                              ) : 'Unknown'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="max-w-xs truncate">
                            {visitor.pageUrl || 'Unknown'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {visitor.sessionId ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {visitor.sessionId.substring(0, 8)}...
                            </span>
                          ) : (
                            'Unknown'
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
                  <div className="flex-1 flex justify-between items-center">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronLeft className="mr-1" /> Previous
                    </button>
                    
                    <div className="hidden md:flex">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`mx-1 px-3 py-1 rounded-md text-sm font-medium ${
                              currentPage === pageNum
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      {totalPages > 5 && (
                        <span className="mx-2 px-2 py-1">...</span>
                      )}
                    </div>
                    
                    <div className="md:hidden text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next <FiChevronRight className="ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Table Footer */}
          <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredVisitors.length)} of {filteredVisitors.length} results
            </p>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <FiDownload className="mr-2" />
              Export Data
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VisitorsAnalyticsPage;