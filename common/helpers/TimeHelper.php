<?php
/**
 * Created by PhpStorm.
 * User: HoangL
 * Date: 02-Jan-16
 * Time: 10:58
 */

namespace common\helpers;


class TimeHelper
{
    public static function time_elapsed_string($ptime)
    {
        $etime = time() - $ptime;
        if ($etime < 1) {
            return 'vừa đăng';
        }
        $a = array(365 * 24 * 60 * 60 => 'year',
            30 * 24 * 60 * 60 => 'month',
            24 * 60 * 60 => 'day',
            60 * 60 => 'hour',
            60 => 'minute',
            1 => 'second'
        );
        $a_plural = array('year' => 'năm',
            'month' => 'tháng',
            'day' => 'ngày',
            'hour' => 'giờ',
            'minute' => 'phút',
            'second' => 'giây'
        );
        foreach ($a as $secs => $str) {
            $d = $etime / $secs;
            if ($d >= 1) {
                $r = round($d);
                return $r . ' ' . $a_plural[$str] . ' trước';
            }
        }
    }

    /**
     * huync2
     * @param $time
     */
    public static function formatTimeArticle($time)
    {
        $time = strtotime($time);
        $array = array(
            'Mon' => 'Thứ 2',
            'Tue' => 'Thứ 3',
            'Wed' => 'Thứ 4',
            'Thu' => 'Thứ 5',
            'Fri' => 'Thứ 6',
            'Sat' => 'Thứ 7',
            'Sun' => 'Chủ nhật',
        );
        return $array[date('D', $time)] . ', ' . date('d/m/Y | H:i', $time);
    }
}