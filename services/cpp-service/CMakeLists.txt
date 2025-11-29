# CMakeLists.txt for cpp-service
cmake_minimum_required(VERSION 3.16)
project(cpp_service)
# Set C++ standard to C++17
set(CMAKE_CXX_STANDARD 17)
# Find and link httplib library
find_package(Pkgconfig REQUIRED)
pkg_check_modules(HTTPLIB REQUIRED IMPORTED_TARGETS httplib)
# Create executable target
add_executable(cpp_service src/main.cpp)
target_link_libraries(cpp_service Pkgconfig::HTTPLIB)

