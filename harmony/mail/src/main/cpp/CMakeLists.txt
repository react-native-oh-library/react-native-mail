cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)

set(rnoh_mail_generated_dir "${CMAKE_CURRENT_SOURCE_DIR}/generated")
file(GLOB_RECURSE rnoh_mail_generated_SRC "${rnoh_mail_generated_dir}/**/*.cpp")
file(GLOB rnoh_mail_SRC CONFIGURE_DEPENDS *.cpp)
add_library(rnoh_mail SHARED ${rnoh_mail_SRC} ${rnoh_mail_generated_SRC})
target_include_directories(rnoh_mail PUBLIC ${CMAKE_CURRENT_SOURCE_DIR} ${rnoh_mail_generated_dir} ${CMAKE_CURRENT_SOURCE_DIR}/generated/RNOH/generated)
target_link_libraries(rnoh_mail PUBLIC rnoh)