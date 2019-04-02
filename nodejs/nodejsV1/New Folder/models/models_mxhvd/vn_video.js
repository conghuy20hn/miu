/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('vn_video', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    //attributes: {
    //  type: DataTypes.BIGINT,
    //  allowNull: true
    //},
    published_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_active: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    price_download: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    price_play: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    play_times: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0'
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    approve_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    type: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    cp_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    cp_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    updated_by: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    tag: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    related_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    seo_title: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: ''
    },
    seo_description: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      defaultValue: ''
    },
    seo_keywords: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      defaultValue: ''
    },
    is_no_copyright: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    like_count: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    bucket: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_hot: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    is_recommend: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    convert_status: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    convert_start_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    convert_end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    duration: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    file_path: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    file_bucket: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    convert_priority: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    resolution: {
      type: DataTypes.STRING(21),
      allowNull: true,
      defaultValue: ''
    },
    snapshot_count: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    upload_process: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    syn_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      unique: true
    },
    name_slug: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description_slug: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    suggest_package_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    review_by: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    mode: {
      type: DataTypes.INTEGER(2),
      allowNull: true,
      defaultValue: '1'
    },
    dislike_count: {
      type: DataTypes.INTEGER(6),
      allowNull: true,
      defaultValue: '0'
    },
    old_playlist_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    comment_count: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    play_times_real: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    show_times: {
      type: DataTypes.DATE,
      allowNull: true
    },
    view_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    outsource_review_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    outsource_review_by: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    outsource_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    outsource_need_review: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    admin_review_first_times_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    admin_review_second_times_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    drm_content_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    multilang: {
      type: DataTypes.STRING(4000),
      allowNull: true
    },
    test_search: {
      type: DataTypes.STRING(1000),
      allowNull: true
    }
  }, {
      tableName: 'vn_video'
    });
};
